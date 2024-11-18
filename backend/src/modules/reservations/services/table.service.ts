import { CrudService } from '@utils/';
import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsRelations, Repository } from 'typeorm';
import { Table } from '../entities/table.entity';
import { CompanyService } from 'src/modules/company/services/company.service';

@Injectable()
export class TableService extends CrudService<Table> {
  constructor(
    @InjectRepository(Table)
    private tableRepo: Repository<Table>,
    @Inject(forwardRef(() => CompanyService))
    private companyService: CompanyService,
  ) {
    super(tableRepo);
  }
  async populate(dto) {
    const company = await this.companyService.findOneById(+dto.company);
    return { ...dto, company: company };
  }

  getFindAllRelations(): FindOptionsRelations<Table> {
    return {
      company: true,
      reservation: {
        user: true,
      },
    };
  }

  getFindOneRelations(): FindOptionsRelations<Table> {
    return {
      company: true,
      reservation: {
        user: true,
      },
    };
  }

  async findAllTablesPerCompany(id: number, params?) {
    return await this.tableRepo.find({
      where: {
        ...params,
        company: {
          id: +id,
        },
      },
      relations: this.getFindAllRelations(),
    });
  }

  async updateTableStatus(id, dto) {
    return await this.tableRepo.update(id, { available: dto.available });
  }
}
