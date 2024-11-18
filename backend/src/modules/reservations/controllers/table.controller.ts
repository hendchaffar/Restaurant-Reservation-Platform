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
import { TableService } from '../services/table.service';
import { QueryParams } from '@utils/';
import { Table } from '../entities/table.entity';
import { JwtAuthGuard } from 'src/modules/auth/guard/auth.guard';
import { ApiBearerAuth } from '@nestjs/swagger';
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
  @Controller('tables')
  export class TableController {
    constructor(private tableService: TableService) {}
  
    @Post()
    create(@Body() dto: any) {
      return this.tableService.saveAfterPopulation(dto);
    }
  
    @Get(':id')
    findAll(@Param('id') id: string,@Query() params?:QueryParams<Table>) {
      return this.tableService.findAllTablesPerCompany(+id,params);
    }
  
    @Get(':id')
    findOne(@Param('id') id: string) {
      return this.tableService.findOneById(+id);
    }
  
    @Patch(':id')
    update(@Param('id') id: string, @Body() updateUserDto: any) {
      return this.tableService.updateAfterPopulation(+id, updateUserDto);
    }
  
    @Delete(':id')
    remove(@Param('id') id: string) {
      return this.tableService.remove(+id);
    }

    @Put('updatestatus/:id')
    updateTableStatus(@Param('id') id: string, @Body() updateUserDto: any) {
      return this.tableService.updateTableStatus(+id, updateUserDto);
    }
  }
  