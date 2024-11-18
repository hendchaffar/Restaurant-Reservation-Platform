import { CrudService } from '@utils/';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsRelations, Repository } from 'typeorm';
import { Company } from '../entities/company.entity';
import { UsersService } from 'src/modules/users/services/users.service';
import { Review } from '../entities/review.entity';
import { ReviewService } from './review.service';

@Injectable()
export class CompanyService extends CrudService<Company> {
  constructor(
    @InjectRepository(Company)
    private companyRepo: Repository<Company>,
    private reviewService: ReviewService,
    private userService: UsersService,
  ) {
    super(companyRepo);
  }

  async populate(dto) {
    let file = null;
    if (dto.logo) {
      const fullUrl = `${dto.protocol}://${dto.host}`;
      file = `${fullUrl}/assets/images/${dto.logo.filename}`;
    }

    const user = await this.userService.findOneById(+dto.manager);

    return {
      ...dto,
      manager: user,
      ...(file && { logo: file }),
    };
  }

  // async populateUpdate(dto) {
  //   const {logo,...reset}=dto;
  //   const user = await this.userService.findOneById(dto.manager);
  //   return {...reset, manager: user };
  // }

  getFindOneRelations(): FindOptionsRelations<Company> {
    return {
      orders: true,
      reservations: true,
      menus: true,
      manager: true,
      tables: true,
      reviews:true
    };
  }

  getFindAllRelations(): FindOptionsRelations<Company> {
    return {
      orders: true,
      reservations: true,
      menus: true,
      manager: true,
      tables: true,
      reviews:true
    };
  }

  async getMostSuccessful() {
    return await this.companyRepo
      .createQueryBuilder('company')
      .leftJoinAndSelect('company.orders', 'orders')
      .leftJoinAndSelect('company.reservations', 'reservations')
      .addSelect('COUNT(orders.id)', 'orderCount')
      .groupBy('company.id')
      .addGroupBy('orders.id')
      .addGroupBy('reservations.id')
      .orderBy('COUNT(orders.id)', 'DESC')
      // .limit(1)
      .getOne();
  }

  async getWorstCompany() {
    return await this.companyRepo
      .createQueryBuilder('company')
      .leftJoinAndSelect('company.orders', 'orders')
      .leftJoinAndSelect('company.reservations', 'reservations')
      .addSelect('COUNT(orders.id)', 'orderCount')
      .groupBy('company.id')
      .addGroupBy('orders.id')
      .addGroupBy('reservations.id')
      .orderBy('COUNT(orders.id)', 'ASC')
      // .limit(1)
      .getOne();
  }
  
  async addReview(id: number, review: Review) {
    const company = await this.findOneById(id);
    if (!company) {
      throw new Error('Company not found');
    }
    if (!company.reviews) {
      company.reviews = [];
    }
    const savedReview = await this.reviewService.saveAfterPopulation(review);
    company.reviews.push(savedReview);
    await this.companyRepo.save(company);
    return company;
  }

  async getReviewsByCompany(userId: number, companyId: number) {
    return await this.companyRepo.findOne({
      where: {
        id: companyId,
        reviews: {
          user: {
            id: userId,
          },
        },
      },
      relations: {
        reviews: true,
      },
    });
  }
}
