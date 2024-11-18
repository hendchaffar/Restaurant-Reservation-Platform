import { BaseEntity } from '@utils/';
import { User } from 'src/modules/users/entities/user.entity';
import { Column, Entity, ManyToOne, OneToMany, OneToOne } from 'typeorm';
import { Order } from './order.entity';
import { Menu } from 'src/modules/menus/entities/menu.entity';

export enum PaymentMethod {
  CreditCard = 'CreditCard',
  CashOnDelivery = 'CashOnDelivery',
}

@Entity()
export class Payment extends BaseEntity {
  @ManyToOne(() => User, (r) => r.payments)
  user: User;

  @OneToOne(() => Order, (r) => r.payment)
  order: Order;

  @Column({
    type:'jsonb',
    nullable:true,
  })
  menus: {
    item: Menu;
    quantity: number;
  }[];

  @Column({
    type: 'float',
  })
  amount: number;

  @Column({
    type: 'enum',
    enum: PaymentMethod,
  })
  paymentType: PaymentMethod;

  @Column({
    type: 'date',
  })
  transactionDate: Date;
}
