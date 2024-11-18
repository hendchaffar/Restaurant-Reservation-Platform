import { BaseEntity } from '@utils/';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToMany,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { Category } from './category.entity';
import { Order } from 'src/modules/orders/entities/order.entity';
import { Company } from 'src/modules/company/entities/company.entity';
import { Payment } from 'src/modules/orders/entities/payment.entity';
@Entity()
export class Menu extends BaseEntity {
  @Column({
    type: 'varchar',
  })
  name: string;

  @Column({
    type: 'varchar',
  })
  description: string;

  @Column({
    type: 'varchar',
  })
  price: number;

  @Column({
    type: 'varchar',
    nullable: true,
  })
  imageURL: string;

  @Column({
    type: 'jsonb',
    nullable: true,
  })
  ingredients: string[];

  @Column({
    type: 'varchar',
  })
  preparationTime: number;

  @Column({
    type: 'int',
    default: 0,
  })
  stockNumber: number;

  @Column({
    type: 'boolean',
  })
  isAvailable: boolean;

  @ManyToOne(() => Category, (category) => category.menus)
  category: Category;

  @ManyToOne(() => Company, (company) => company.menus)
  company: Company;

 
}
