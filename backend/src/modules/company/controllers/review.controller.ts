import { Body, Controller, Param, Patch, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/modules/auth/guard/auth.guard';
import { ReviewService } from '../services/review.service';

@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@Controller('reviews')
@ApiTags('reviews')
export class ReviewController {
  constructor(private reviewService: ReviewService) {}

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: any) {
    return this.reviewService.updateAfterPopulation(+id, dto);
  }
}
