import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { CrudService } from '@utils/';
import { Role, User } from '../entities/user.entity';
import { FindOptionsRelations, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import * as bycrpt from 'bcrypt';
import { StreamNotificationsGateway } from 'src/modules/web-socket/services/stream-data';
import { NotificationService } from 'src/modules/notification/services/notification.service';
import {
  NotificationFor,
  NotificationType,
} from 'src/modules/notification/entities/notification.entity';
@Injectable()
export class UsersService extends CrudService<User> {
  constructor(
    @InjectRepository(User)
    private userRepo: Repository<User>,
    @Inject(forwardRef(() => NotificationService))
    private notificationService: NotificationService,
    private streamNotificationsGateway: StreamNotificationsGateway,
  ) {
    super(userRepo);
  }
  async create(dto) {
    const saveduser = await this.saveAfterPopulation(dto);
    if (saveduser) {
      const allAdmins = await this.userRepo.find({
        where: {
          role: Role.ADMIN,
        },
      });
      for (const admin of allAdmins) {
        const notif = await this.notificationService.createNotification({
          description: `${saveduser.firstname} ${saveduser.lastname} created an account as ${saveduser.role.toLowerCase()} at ${saveduser.createdAt}`,
          user: admin,
          company: null,
          notificationType: NotificationType.app_management,
          notificationFor: NotificationFor.adminNotifications,
          readed: false,
        });
        this.streamNotificationsGateway.brodcastManagerNotification(
          `${admin.id}`,
          notif,
        );
      }
    }
    return saveduser;
  }

  async populate(dto:User) {
    const passwordHash = await bycrpt.hash(dto.password, 10);
    if(dto.role==Role.ADMIN || dto.role==Role.CLIENT){
      dto.isConfirmedByAdministrator=true;
    }
    return { ...dto, password: passwordHash };
  }


  async populateUpdate(dto: any) {
    if (dto.password && dto.password !== "") {
      dto.password = await bycrpt.hash(dto.password, 10);
    } else if (dto.password === "") {
      const { password, ...reset } = dto;
      return reset;
    }
    
    return dto; 
  }
  

  getFindOneRelations(): FindOptionsRelations<User> {
    return {
      company: {
        tables: true,
      },
      reservation: true,
      payments: true,
    };
  }

  getFindAllRelations(): FindOptionsRelations<User> {
    return {
      company: {
        tables: true,
      },
      reservation: true,
      payments: true,
    };
  }
}
