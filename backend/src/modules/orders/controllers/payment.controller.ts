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
import { PaymentService } from '../services/payment.service';
import { QueryParams } from '@utils/';
import { Payment } from '../entities/payment.entity';
import { JwtAuthGuard } from 'src/modules/auth/guard/auth.guard';
import { ApiBearerAuth } from '@nestjs/swagger';
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@Controller('payment')
export class PaymentController {
  constructor(private paymentService: PaymentService) {}

  @Post('payment-stripe')
  paymentStripe(@Body() body:any){
    return this.paymentService.createPayment();
  }
  @Get('payment-stripe-credentials')
  getPaymentStripeCredentials(){
    return {
      STRIPE_PUBLIC_KEY:process.env.PublishableKey
    }
  }
  
  @Post()
  create(@Body() dto: any) {
    return this.paymentService.create(dto);
  }

  @Get()
  findAll(@Query() params?:QueryParams<Payment>) {
    return this.paymentService.findAll(params);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.paymentService.findOneById(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: any) {
    return this.paymentService.updateAfterPopulation(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.paymentService.remove(+id);
  }
}
