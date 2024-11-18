import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Patch,
    Post,
    Query,
    UseGuards,
  } from '@nestjs/common';
  import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
  import { Public } from 'src/modules/auth/decorators/public.decorator';
  import { JwtAuthGuard } from 'src/modules/auth/guard/auth.guard';
  import { QueryParams } from '@utils/';
import { ChatService } from '../services/chat.service';
import { Chat } from '../entities/chat.entity';
  
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Controller('chats')
  @ApiTags('chats')
  export class ChatController {
    constructor(private chatService: ChatService) {}
  
    @Public()
    @Post()
    create(@Body() dto: any) {
      return this.chatService.saveAfterPopulation(dto);
    }
  
    @Get()
    findAll(@Query() params?:QueryParams<Chat>) {
      return this.chatService.findAll(params);
    }
  
    @Get('chatperuser')
    findOne(@Query() params?:QueryParams<Chat>) {
      return  this.chatService.findChat(params);
    }
  
    @Patch(':id')
    async update(@Param('id') id: string, @Body() dto: any) {
      return await this.chatService.updateAfterPopulation(+id, dto);
    }
  
    @Delete(':id')
    remove(@Param('id') id: string) {
      return this.chatService.remove(+id);
    }
  }
  