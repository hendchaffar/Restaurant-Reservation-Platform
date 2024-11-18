import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CategoriesService } from '../services/categories.service';
import { QueryParams } from '@utils/';
import { Category } from '../entities/category.entity';
import { JwtAuthGuard } from 'src/modules/auth/guard/auth.guard';
import { ApiBearerAuth } from '@nestjs/swagger';

@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@Controller('categories')
export class CategoriesController {
  constructor(private categoriesService: CategoriesService) {}

  @Post()
  create(@Body() dto: any) {
    return this.categoriesService.saveAfterPopulation(dto);
  }

  @Get()
  findAll(@Query() params:QueryParams<Category>) {
    return this.categoriesService.findAll(params);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.categoriesService.findOneById(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: any) {
    return this.categoriesService.updateAfterPopulation(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.categoriesService.remove(+id);
  }
}
