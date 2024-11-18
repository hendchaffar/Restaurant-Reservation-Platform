import { forwardRef, Module } from '@nestjs/common';
import { MenuController } from './controllers/menu.controller';
import { MenuService } from './services/menu.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from './entities/category.entity';
import { Menu } from './entities/menu.entity';
import { CategoriesService } from './services/categories.service';
import { CategoriesController } from './controllers/category.controller';
import { MulterModule } from '@nestjs/platform-express';
import { storage } from 'src/utils/storage';
import { CompanyModule } from '../company/company.module';

@Module({
  imports: [
    MulterModule.register({
      storage: storage,
    }),
    forwardRef(() => CompanyModule),
    TypeOrmModule.forFeature([Category, Menu]),
  ],
  controllers: [MenuController,CategoriesController,],
  providers: [
    MenuService,
    CategoriesService,
  ],
  exports: [
    MenuService,
    CategoriesService,
  ],
})
export class MenusModule {}
