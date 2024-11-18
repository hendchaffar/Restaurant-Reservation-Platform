import { CrudService } from '@utils/';
import { Reservation, Status } from '../entities/reservation.entity';
import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsRelations, Repository } from 'typeorm';
import { UsersService } from 'src/modules/users/services/users.service';
import { CompanyService } from 'src/modules/company/services/company.service';
import { TableService } from './table.service';
import { StreamNotificationsGateway } from 'src/modules/web-socket/services/stream-data';
import { NotificationService } from 'src/modules/notification/services/notification.service';
import {
  NotificationFor,
  NotificationType,
} from 'src/modules/notification/entities/notification.entity';

@Injectable()
export class ReservationService extends CrudService<Reservation> {
  constructor(
    @InjectRepository(Reservation)
    private reservationRepo: Repository<Reservation>,
    private userService: UsersService,
    @Inject(forwardRef(() => CompanyService))
    private companyService: CompanyService,
    @Inject(forwardRef(() => TableService))
    private tableService: TableService,
    @Inject(forwardRef(() => NotificationService))
    private notificationService: NotificationService,
    private streamNotificationsGateway: StreamNotificationsGateway,
  ) {
    super(reservationRepo);
  }
  async populate(dto) {
    const user = await this.userService.findOneById(dto.user);
    const company = await this.companyService.findOneById(dto.company);
    const table = await this.tableService.findOneById(dto.table);
    if(user && company && table){
        await this.tableService.update(table.id, { available: false });
        const notif = await this.notificationService.createNotification({
          description: `${user.firstname} ${user.lastname} has made a reservation for a table of ${table.tableSize} at ${dto.date} ${dto.time}`,
          user: company.manager,
          company: company,
          notificationType: NotificationType.reservationStatusChange,
          notificationFor: NotificationFor.managerNotifications,
          readed:false
        });

        this.streamNotificationsGateway.brodcastManagerNotification(
          `${company.manager.id}-${company.id}`,
          notif,
        );
      }
      return { ...dto, user: user, table: table, company: company };
    
  
  }

  getFindAllRelations(): FindOptionsRelations<Reservation> {
    return {
      company: {
        manager:true
      },
      user: true,
      table: true,
    };
  }

  getFindOneRelations(): FindOptionsRelations<Reservation> {
    return {
      company: {
        manager:true
      },
      user: true,
      table: true,
    };
  }

  async deleteReservation(idReservation: number, idUser: number) {
    const reservation = await this.reservationRepo.findOne({
      where: {
        id: idReservation,
        user: { id: idUser },
      },
      relations: this.getFindAllRelations(),
    });
    await this.tableService.update(reservation.table?.id, { available: true });
    const notif = await this.notificationService.createNotification({
      description: `${reservation.user.firstname} ${reservation.user.lastname} has cancelled his reservation for a table of ${reservation.table.tableSize} at ${reservation.date} ${reservation.time}`,
      user: reservation.company.manager,
      company: reservation.company,
      notificationType: NotificationType.reservationStatusChange,
      notificationFor: NotificationFor.managerNotifications,
      readed:false
    });
    this.streamNotificationsGateway.brodcastManagerNotification(
      `${reservation.company.manager.id}-${reservation.company.id}`,
      notif,
    );
    reservation.company = null;
    reservation.user = null;
    reservation.table = null;
    await this.reservationRepo.save(reservation);
  
    return await this.reservationRepo.delete(+reservation.id);
  }

  async findreservationsperuser(id: number) {
    return await this.reservationRepo.find({
      where: {
        user: {
          id: +id,
        },
      },
      relations: this.getFindAllRelations(),
    });
  }

  async findreservationsPerCompany(id: number) {
    return await this.reservationRepo.find({
      where: {
        company: {
          id: +id,
        },
      },
      relations: this.getFindAllRelations(),
    });
  }

  async changeStatus(id:number,dto){
     await this.reservationRepo.update(id,{
      status: dto.status
    })
    const reservation=await this.findOneById(id);
    const table=await this.tableService.update(reservation.table.id,{
      available: reservation.status==Status.Confirmed ? false : true
    })
    const notif = await this.notificationService.createNotification({
      description: `Your reservation for a table of ${reservation.table.tableSize} at ${reservation.date} ${reservation.time} has been ${reservation.status}`,
      user: reservation.user,
      company: reservation.company,
      notificationType: NotificationType.reservationStatusChange,
      notificationFor: NotificationFor.clientNotifications,
      readed:false
    });
    this.streamNotificationsGateway.brodcastManagerNotification(
      `${reservation.user.id}-${reservation.company.id}`,
      notif,
    );
    return reservation;
  }
}
