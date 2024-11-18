import { BaseEntity } from '@utils/';
import { Category } from 'src/modules/menus/entities/category.entity';
import { Menu } from 'src/modules/menus/entities/menu.entity';
import { Order } from 'src/modules/orders/entities/order.entity';
import { Reservation } from 'src/modules/reservations/entities/reservation.entity';
import { Table } from 'src/modules/reservations/entities/table.entity';
import { User } from 'src/modules/users/entities/user.entity';
import { Column, Entity, OneToMany, OneToOne } from 'typeorm';
import { Review } from './review.entity';

export enum CompanyType {
  Restaurant = 'Restaurant',
  Coffeshop = 'Coffeshop',
  Bakery = 'Bakery',
}

@Entity()
export class Company extends BaseEntity {
  @Column({ type: 'varchar' })
  name: string;

  @Column({ type: 'varchar' })
  address: string;

  @Column({ type: 'varchar' })
  phone: string;

  @Column({ type: 'varchar', nullable: true })
  logo: string;

  @Column({ type: 'varchar', nullable: true })
  startHour: string;

  @Column({ type: 'varchar', nullable: true })
  endHour: string;

  @Column({
    type: 'enum',
    enum: CompanyType,
  })
  type: CompanyType;

  // @Column({
  //   type:'int',
  //   nullable: true,
  // })
  // totalRating:number

  @OneToMany(() => Reservation, (r) => r.company)
  reservations: Reservation[];

  @OneToMany(() => Menu, (r) => r.company)
  menus: Menu[];

  @OneToMany(() => Order, (r) => r.company)
  orders: Order[];

  @OneToOne(() => User, (r) => r.company)
  manager: User;

  @OneToMany(() => Table, (r) => r.company)
  tables: Table[];

  @OneToMany(() => Category, (r) => r.company)
  categories: Category[];

  @OneToMany(() => Review, (r) => r.company)
  reviews: Review[];
}
