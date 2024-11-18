import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { MenusModule } from '../menus/menus.module';
import { Payment } from './entities/payment.entity';
import { PaymentService } from './services/payment.service';
import { OrderService } from './services/order.service';
import { PaymentController } from './controllers/payment.controller';
import { OrderController } from './controllers/order.controller';
import { CompanyModule } from '../company/company.module';
import { NotificationModule } from '../notification/notification.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Order, Payment]),
    forwardRef(() => MenusModule),
    forwardRef(() => CompanyModule),
    forwardRef(() => NotificationModule),

  ],
  controllers: [OrderController, PaymentController],
  providers: [PaymentService, OrderService],
  exports: [PaymentService, OrderService],
})
export class OrdersModule {}
