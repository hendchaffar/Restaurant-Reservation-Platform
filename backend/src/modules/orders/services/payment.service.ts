import { CrudService } from '@utils/';
import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsRelations, Repository } from 'typeorm';
import { Payment } from '../entities/payment.entity';
import { UsersService } from 'src/modules/users/services/users.service';
import { OrderService } from './order.service';
import { Order, OrderStatus, PaymentStatus } from '../entities/order.entity';
import { MenuService } from 'src/modules/menus/services/menu.service';
import { CompanyService } from 'src/modules/company/services/company.service';
const stripe = require('stripe')("sk_test_51Q4jETL6M6fCF0V5m2qn0NRQlPBvcpFPwEndaOQimSwnn1KetvpnljClKrjl4MEzUgkJTvFHQPmJzD2mCQ6cFzgi001IfNlt4J");

@Injectable()
export class PaymentService extends CrudService<Payment> {
  constructor(
    @InjectRepository(Payment)
    private paymentRepo: Repository<Payment>,
    private userService: UsersService,
    @Inject(forwardRef(() => OrderService))
    private orderService: OrderService,
    @Inject(forwardRef(() => MenuService))
    private menuService: MenuService,
    @Inject(forwardRef(() => CompanyService))
    private companyService: CompanyService,
  ) {
    super(paymentRepo);
  }

  async create(dto) {
    const payment = await this.saveAfterPopulation(dto);
    const order = await this.orderService.create({
      user: payment.user,
      totalPrice: dto.amount,
      orderType: dto.orderType,
      paymentStatus: dto.paymentStatus,
      status: OrderStatus.Preparing,
      company: await this.companyService.findOneById(dto.company),
      payment: payment,
    });
    return payment;
  }

  async populate(dto) {
    const user = await this.userService.findOneById(dto.user);
    const items = dto.items;

    return { ...dto, user: user, items: items, transactionDate: new Date() };
  }

  getFindAllRelations(): FindOptionsRelations<Payment> {
    return {
      user:true,
      order:{
        company:true
      }
    }
  }

  getFindOneRelations(): FindOptionsRelations<Payment> {
    return {
      user:true,
      order:{
        company:true
      }
    }
  }

  async createPayment() {
    try {
      const paymentIntent = await stripe.paymentIntents.create({
        currency: 'EUR',
        amount: 1999,
        automatic_payment_methods: { enabled: true },
      });
      console.log('Payment',paymentIntent)
      return {
        clientSecret: paymentIntent.client_secret,
      };
    } catch (e) {
      return {
        error: {
          message: e.message,
        },
      };
    }
  }
}
