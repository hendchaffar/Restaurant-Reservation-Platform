import { CrudService } from '@utils/';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsRelations, Repository } from 'typeorm';
import { Category } from '../entities/category.entity';

@Injectable()
export class CategoriesService extends CrudService<Category> {
  constructor(
    @InjectRepository(Category)
    private categoryRepo: Repository<Category>,
  ) {
    super(categoryRepo);
  }

  async populate(dto) {
    return dto;
  }

  getFindAllRelations(): FindOptionsRelations<Category> {
    return {
      menus: true,
      company: true,
    };
  }
  getFindOneRelations(): FindOptionsRelations<Category> {
    return {
      menus: true,
      company: true,
    };
  }

  async findCategoryPerCompany(id: number) {
    return await this.categoryRepo.find({
      where: {
        company: {
          id: +id,
        },
      },
      relations: {
        company: true,
      },
    });
  }
}
