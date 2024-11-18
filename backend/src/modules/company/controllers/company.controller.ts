import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { CompanyService } from '../services/company.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from 'src/modules/auth/guard/auth.guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@Controller('companies')
@ApiTags('companies')
export class CompanyController {
  constructor(private companyService: CompanyService) {}

  @Post()
  @UseInterceptors(FileInterceptor('logo'))
  create(@Req() req: any, @UploadedFile() logo: any) {
    const protocol = req.protocol;
    const host = req.get('Host');
    return this.companyService.saveAfterPopulation({
      ...req.body,
      logo: logo,
      protocol: protocol,
      host: host,
    });
  }

  @Post('addreview/:id')
  addReview(@Param('id') id: number, @Body() dto: any) {
    return this.companyService.addReview(id, dto);
  }

  @Get('get/reviews/:userId/:companyId')
  findReview(
    @Param('userId') userId: number,
    @Param('companyId') companyId: number,
  ) {
    return this.companyService.getReviewsByCompany(userId, companyId);
  }
  @Get()
  findAll() {
    return this.companyService.findAll();
  }
  @Get('mostsuccessful')
  getMostsuccessful() {
    return this.companyService.getMostSuccessful();
  }

  @Get('worstperformance')
  getWorstCompany() {
    return this.companyService.getWorstCompany();
  }
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.companyService.findOneById(+id);
  }

  @Patch(':id')
  @UseInterceptors(FileInterceptor('logo'))
  async update(
    @Param('id') id: string,
    @Req() req: any,
    @UploadedFile() logo: any,
  ) {
    const protocol = req.protocol;
    const host = req.get('Host');

    return await this.companyService.updateAfterPopulation(+id, {
      ...req.body,
      logo: logo,
      protocol: protocol,
      host: host,
    });
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.companyService.remove(+id);
  }
}
