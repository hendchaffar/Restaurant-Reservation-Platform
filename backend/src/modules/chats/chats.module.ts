import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Chat } from './entities/chat.entity';
import { Message } from './entities/message.entity';
import { ChatService } from './services/chat.service';
import { MessageService } from './services/message.service';
import { ChatController } from './controllers/chat.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Chat,Message])],
  controllers: [ChatController],
  providers:[ChatService,MessageService],
  exports: [ChatService,MessageService],
})
export class ChatModule {}
