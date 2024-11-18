import { ApiProperty } from '@nestjs/swagger';
import { BaseEntity } from '@utils/';
import { Column, Entity, ManyToOne } from 'typeorm';
import { Chat } from './chat.entity';
import { User } from 'src/modules/users/entities/user.entity';

@Entity()
export class Message extends BaseEntity {
  @Column({
    type: 'text',
  })
  content: string;

  @ManyToOne(()=>User,{eager: true})
  sender: User;

  @ApiProperty()
  @Column({
    type: 'timestamp',
  })
  timestamp: Date;

  @ApiProperty()
  @Column({
    type: 'boolean',
    default: false,
  })
  read_status: boolean;

  @ManyToOne(()=>Chat,r=>r.messages)
  chat:Chat
}
