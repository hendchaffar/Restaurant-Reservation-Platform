import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Company } from './entities/company.entity';
import { CompanyService } from './services/company.service';
import { CompanyController } from './controllers/company.controller';
import { MulterModule } from '@nestjs/platform-express';
import { storage } from 'src/utils/storage';
import { ReviewService } from './services/review.service';
import { Review } from './entities/review.entity';
import { ReviewController } from './controllers/review.controller';

@Module({
  imports: [
    MulterModule.register({
      storage: storage,
    }),
    TypeOrmModule.forFeature([Company,Review])],
  controllers: [CompanyController,ReviewController],
  providers: [CompanyService,ReviewService],
  exports: [CompanyService,ReviewService],
})
export class CompanyModule {}
