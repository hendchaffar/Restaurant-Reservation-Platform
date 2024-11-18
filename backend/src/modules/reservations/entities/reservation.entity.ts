import { BaseEntity } from '@utils/';
import { User } from 'src/modules/users/entities/user.entity';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne } from 'typeorm';
import { Table } from './table.entity';
import { Company } from 'src/modules/company/entities/company.entity';

export enum Status {
  Confirmed = 'Confirmed',
  Pending = 'Pending',
  Cancelled = 'Cancelled',
}
@Entity()
export class Reservation extends BaseEntity {
  @Column({
    type: 'date',
  })
  date: Date;

  @Column({
    type: 'varchar',
  })
  time: Date;

  @Column({
    type: 'varchar',
  })
  numberOfPeople: string;

  @OneToOne(()=>Table,relation=>relation.reservation)
  @JoinColumn()
  table: Table;

  @Column({
    type: 'enum',
    enum: Status,
    default:Status.Pending,
  })
  status: Status;

  @ManyToOne(() => User, user => user.reservation)
  user: User;

  @ManyToOne(()=>Company, company => company.reservations)
  company:Company
}
