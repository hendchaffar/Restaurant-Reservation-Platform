import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { CrudService } from '@utils/';
import { Menu } from '../entities/menu.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsRelations, Repository } from 'typeorm';
import { CategoriesService } from './categories.service';
import { CompanyService } from 'src/modules/company/services/company.service';

@Injectable()
export class MenuService extends CrudService<Menu> {
  constructor(
    @InjectRepository(Menu)
    private menuRepo: Repository<Menu>,
    @Inject(forwardRef(() => CategoriesService))
    private categoriesService: CategoriesService,
    @Inject(forwardRef(() => CompanyService))
    private companyService: CompanyService,
  ) {
    super(menuRepo);
  }

  async populate(dto) {
    const category = await this.categoriesService.findOneById(dto.category);
    const company = await this.companyService.findOneById(dto.company);

    return { ...dto, category: category, company: company };
  }

  async updateMenu(id, dto) {
    const { imageURL, ...rest } = dto;
    const dataToUpdate = imageURL ? { ...rest, imageURL } : rest;
    return await this.updateAfterPopulation(id, dataToUpdate);
  }

  getFindAllRelations(): FindOptionsRelations<Menu> {
    return {
      category: true,
      company: true,
    };
  }

  getFindOneRelations(): FindOptionsRelations<Menu> {
    return {
      category: true,
      company: true,
    };
  }
}
