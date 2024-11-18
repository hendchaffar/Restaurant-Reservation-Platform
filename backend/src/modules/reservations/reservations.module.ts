import { forwardRef, Module } from '@nestjs/common';
import { ReservationService } from './services/reservation.service';
import { ReservationController } from './controllers/reservation.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Reservation } from './entities/reservation.entity';
import { Table } from './entities/table.entity';
import { CompanyModule } from '../company/company.module';
import { TableController } from './controllers/table.controller';
import { TableService } from './services/table.service';
import { NotificationModule } from '../notification/notification.module';

@Module({
  imports: [
    forwardRef(() => CompanyModule),
    forwardRef(() => NotificationModule),
    TypeOrmModule.forFeature([Reservation, Table]),
  ],
  controllers: [ReservationController,TableController],
  providers: [ReservationService,TableService],
  exports: [ReservationService,TableService],
})
export class ReservationsModule {}
