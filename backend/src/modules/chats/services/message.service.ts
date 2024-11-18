import { CrudService } from '@utils/';
import { Chat } from '../entities/chat.entity';
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Message } from '../entities/message.entity';

@Injectable()
export class MessageService extends CrudService<Message> {
  constructor(
    @InjectRepository(Chat)
    private mesageRepo: Repository<Message>,
  ) {
    super(mesageRepo);
  }
  async populate(dto) {
    return dto;
  }
}
