import { CrudService, QueryParams } from '@utils/';
import { Chat } from '../entities/chat.entity';
import { Injectable } from '@nestjs/common';
import { FindOptionsRelations, FindOptionsWhere, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class ChatService extends CrudService<Chat> {
  constructor(
    @InjectRepository(Chat)
    private chatRepo: Repository<Chat>,
  ) {
    super(chatRepo);
  }
  async populate(dto) {
    return dto;
  }
  async findChat(params?:QueryParams<Chat>){
    return await this.chatRepo.findOne({
      where:params as unknown as FindOptionsWhere<Chat>,
      relations: this.getFindOneRelations(),
    })
  }

  getFindAllRelations(): FindOptionsRelations<Chat> {
    return {
      client: true,
      manager: true,
      messages: true,
    };
  }

  getFindOneRelations(): FindOptionsRelations<Chat> {
    return {
      client: true,
      manager: true,
      messages: true,
    };
  }
}
