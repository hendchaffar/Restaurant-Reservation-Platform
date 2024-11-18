import { BaseEntity } from '@utils/';
import { Company } from 'src/modules/company/entities/company.entity';
import { Notification } from 'src/modules/notification/entities/notification.entity';
import { Payment } from 'src/modules/orders/entities/payment.entity';
import { Reservation } from 'src/modules/reservations/entities/reservation.entity';
import { Column, Entity, JoinColumn, OneToMany, OneToOne } from 'typeorm';

export enum Role {
  CLIENT = 'CLIENT',
  MANAGER = 'MANAGER',
  ADMIN = 'ADMIN',
}

@Entity()
export class User extends BaseEntity {
  @Column({
    type: 'varchar',
  })
  firstname: string;

  @Column({
    type: 'varchar',
  })
  lastname: string;

  @Column({
    type: 'varchar',
  })
  email: string;

  @Column({
    type: 'varchar',
    nullable: true,
  })
  address: string;

  @Column({
    type: 'varchar',
    nullable: true,
  })
  phone: string;

  @Column({
    type: 'varchar',
  })
  password: string;

  @Column({
    type: 'enum',
    enum: Role,
  })
  role: Role;

  @Column({
    type: 'boolean',
    default: true,
  })
  enable: boolean;

  @Column({
    type: 'boolean',
    default: false,
  })
  isConfirmedByAdministrator: boolean;

  @OneToMany(() => Payment, (r) => r.user)
  payments: Payment[];

  @OneToMany(() => Reservation, (reservation) => reservation.user)
  reservation: Reservation;

  @OneToOne(() => Company, (r) => r.manager)
  @JoinColumn()
  company: Company;

  @OneToMany(() => Notification, (r) => r.user)
  notifications: Notification[];
}
