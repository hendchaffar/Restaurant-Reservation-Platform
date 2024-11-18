import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { MenuService } from '../services/menu.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { QueryParams } from '@utils/';
import { Menu } from '../entities/menu.entity';
import { JwtAuthGuard } from 'src/modules/auth/guard/auth.guard';
import { ApiBearerAuth } from '@nestjs/swagger';
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@Controller('menus')
export class MenuController {
  constructor(private menuService: MenuService) {}

  @Post()
  @UseInterceptors(FileInterceptor('imageURL'))
  create(@Req() req: any,@UploadedFile() imageURL:any) {
    const protocol = req.protocol;
    const host = req.get('Host');
    const fullUrl = protocol + "://" + host;
    const file=fullUrl+'/assets/images/'+imageURL.filename;
    return this.menuService.saveAfterPopulation({...req.body,imageURL:file});
  }

  @Get()
  findAll(@Query()params?:QueryParams<Menu>) {
    return this.menuService.findAll(params);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.menuService.findOneById(+id);
  }

  @Patch(':id')
  @UseInterceptors(FileInterceptor('imageURL'))
  update(@Param('id') id: string, @Req() req: any,@UploadedFile() imageURL:any) {
    const protocol = req.protocol;
    const host = req.get('Host');
    const fullUrl = protocol + "://" + host;
    const file=imageURL ? fullUrl+'/assets/images/'+imageURL.filename : null;
    return this.menuService.updateMenu(+id, {...req.body,imageURL:file});
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.menuService.remove(+id);
  }
}
