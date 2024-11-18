import { BaseEntity } from '@utils/';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne } from 'typeorm';
import { Payment } from './payment.entity';
import { Company } from 'src/modules/company/entities/company.entity';
import { User } from 'src/modules/users/entities/user.entity';

export enum OrderStatus {
  Preparing = 'Preparing',
  ReadyForPickup = 'ReadyForPickup',
  OutForDelivery = 'OutForDelivery',
  Delivered = 'Delivered',
  Completed = 'Completed',
}

export enum OrderType {
  Pickup = 'Pickup',
  Delivery = 'Delivery'
}

export enum PaymentStatus {
  Unpaid = 'Unpaid',
  Paid = 'Paid',
  Failed = 'Failed',
}

@Entity()
export class Order extends BaseEntity {
  @Column({
    type: 'enum',
    enum: OrderStatus,
  })
  status: OrderStatus;

  // @ManyToMany(() => Menu, (relation) => relation.orders)
  // items: Menu[];
  @ManyToOne(()=>User)
  user:User;
  
  @ManyToOne(()=>Company, company => company.orders)
  company:Company

  @Column({
    type: 'float',
    default: 0,
  })
  totalPrice: number;

  @Column({
    type: 'enum',
    enum: OrderType,
  })
  orderType: OrderType;

  @Column({
    type: 'enum',
    enum: PaymentStatus,
  })
  paymentStatus: PaymentStatus;

  @OneToOne(() => Payment, (r) => r.order)
  @JoinColumn()
  payment: Payment;


}
