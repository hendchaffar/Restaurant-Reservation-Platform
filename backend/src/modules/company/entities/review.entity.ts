import { BaseEntity } from '@utils/';
import { User } from 'src/modules/users/entities/user.entity';
import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from 'typeorm';
import { Company } from './company.entity';

@Entity()
export class Review extends BaseEntity {
  @Column({
    type: 'int',
  })
  rating: number;

  @Column({
    type: 'text',
    nullable: true,
  })
  comment: string;

  @ManyToOne(() => User,{eager: true})
  user: User;

  @ManyToOne(() => Company, (r) => r.reviews)
  company: Company;
}
