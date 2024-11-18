import { Injectable } from '@nestjs/common';
import {
  WebSocketGateway,
  MessageBody,
  OnGatewayConnection,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'socket.io';

@Injectable()
@WebSocketGateway({ cors: '*:*' })
export class StreamNotificationsGateway implements OnGatewayConnection {
  handleConnection(client: any, ...args: any[]) {}

  @WebSocketServer()
  server: Server;

  brodcastManagerNotification(
    companyIdUserId: string,//userId+companyId
    @MessageBody() notification: any,
  ) {
    this.server.emit(companyIdUserId, notification);
  }
}
