import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Patch,
    Post,
    Put,
    Query,
    UseGuards,
  } from '@nestjs/common';
import { OrderService } from '../services/order.service';
import { Order } from '../entities/order.entity';
import { QueryParams } from '@utils/';
import { JwtAuthGuard } from 'src/modules/auth/guard/auth.guard';
import { ApiBearerAuth } from '@nestjs/swagger';
  
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
  @Controller('orders')
  export class OrderController {
    constructor(private orderService: OrderService) {}
  
    @Post()
    create(@Body() dto: any) {
      return this.orderService.saveAfterPopulation(dto);
    }
  
    @Get()
    findAll(@Query()params?:QueryParams<Order>) {
      return this.orderService.findAll(params);
    }
  
    @Get(':id')
    findOne(@Param('id') id: string) {
      return this.orderService.findOneById(+id);
    }
  
    @Patch(':id')
    update(@Param('id') id: string, @Body() updateUserDto: any) {
      return this.orderService.updateAfterPopulation(+id, updateUserDto);
    }
  
    @Delete(':id')
    remove(@Param('id') id: string) {
      return this.orderService.remove(+id);
    }

    @Put('changeStatus/:id')
    changeStatus(@Param('id') id: string,@Body() dto:any) {
      return this.orderService.changeStatus(+id,dto);
    }
  }
  