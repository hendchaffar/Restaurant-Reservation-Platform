import { BaseEntity } from '@utils/';
import { Column, Entity, ManyToOne, OneToOne } from 'typeorm';
import { Reservation } from './reservation.entity';
import { Company } from 'src/modules/company/entities/company.entity';

@Entity()
export class Table extends BaseEntity {
  @Column({
    type: 'varchar',
  })
  tableNumber: string;

  @Column({
    type: 'int',
    default: 0,
  })
  tableSize: number;

  @Column({
    type: 'boolean',
    default: true,
  })
  available: boolean;

  @ManyToOne(()=>Company,r=>r.tables)
  company: Company;

  @OneToOne(() => Reservation, (r) => r.table)
  reservation: Reservation;
}
