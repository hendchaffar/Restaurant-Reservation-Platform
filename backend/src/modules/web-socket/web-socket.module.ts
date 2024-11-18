import { Global, Module } from '@nestjs/common';
import { StreamNotificationsGateway } from './services/stream-data';

@Global()
@Module({
  imports: [],
  providers: [StreamNotificationsGateway],
  exports: [StreamNotificationsGateway],
})
export class WebSocketModule {}
