import { ApiProperty } from '@nestjs/swagger';
import { BaseEntity } from '@utils/';
import { User } from 'src/modules/users/entities/user.entity';
import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { Message } from './message.entity';

@Entity()
export class Chat extends BaseEntity {
  @ManyToOne(() => User)
  client: User;

  @ManyToOne(() => User)
  manager: User;

  @OneToMany(() => Message, (r) => r.chat)
  messages: Message[];
}
