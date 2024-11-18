import { Injectable } from '@nestjs/common';
import { CrudService } from '@utils/';
import { FindOptionsRelations, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Notification } from '../entities/notification.entity';

@Injectable()
export class NotificationService extends CrudService<Notification> {
  constructor(
    @InjectRepository(Notification)
    private notifRepo: Repository<Notification>,
  ) {
    super(notifRepo);
  }
  async createNotification(notif: Notification) {
    return await this.saveAfterPopulation(notif);
  }

  async populate(dto) {
    return { ...dto };
  }

  async findNotifPerUser(userId:number) {
    return await this.notifRepo.find({
      where: {
        user: {
          id: +userId,
        },
        readed: false,
      },
      relations: this.getFindOneRelations(),
      order:{
        createdAt: 'DESC'  
      }
    });
  }

  getFindOneRelations(): FindOptionsRelations<Notification> {
    return {
      company: true,
      user: true,
    };
  }

  getFindAllRelations(): FindOptionsRelations<Notification> {
    return {
      company: true,
      user: true,
    };
  }

  async resetVisibilityOfNotifications(idUser){
    const notifs=await this.notifRepo.find({
      where:{
        user:{
          id:+idUser
        }
      },
      relations: this.getFindAllRelations()
    })
    for (const n of notifs){
      await this.notifRepo.update(n.id, { readed: true });

    }
    return notifs;
  }
}
