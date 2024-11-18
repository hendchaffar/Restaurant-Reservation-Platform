import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './modules/users/users.module';
import { MenusModule } from './modules/menus/menus.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './modules/auth/auth.module';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { AllExceptionsFilter, LoggingInterceptor } from './utils';
import { ReservationsModule } from './modules/reservations/reservations.module';
import { OrdersModule } from './modules/orders/orders.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { CompanyModule } from './modules/company/company.module';
import { MulterModule } from '@nestjs/platform-express';
import { storage } from './utils/storage';
import { WebSocketModule } from './modules/web-socket/web-socket.module';
import { NotificationModule } from './modules/notification/notification.module';
import { ChatModule } from './modules/chats/chats.module';

@Module({
  imports: [
    MulterModule.register({
      storage: storage,
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'src', 'assets', 'images'),
      serveRoot: '/assets/images',
    }),
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DATABASE_HOST,
      port: parseInt(process.env.DATABASE_PORT, 10) || 5432,
      username: process.env.DATABASE_USERNAME,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_NAME,
      autoLoadEntities: true,
      synchronize: true,
      ssl: process.env.DATABASE_ENABLE_SSL === 'true' ? true : false,
    }),
    AuthModule,
    UsersModule,
    MenusModule,
    ReservationsModule,
    OrdersModule,
    CompanyModule,
    WebSocketModule,
    NotificationModule,
    ChatModule
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },
  ],
})
export class AppModule {}
