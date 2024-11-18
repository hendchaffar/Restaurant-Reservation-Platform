import { CrudService } from '@utils/';
import { Review } from '../entities/review.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class ReviewService extends CrudService<Review> {
  constructor(
    @InjectRepository(Review)
    private reviewRepo: Repository<Review>,
  ) {
    super(reviewRepo);
  }
  populate(dto) {
    return dto;
  }
}
