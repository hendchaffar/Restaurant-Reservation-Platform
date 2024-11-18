import { CrudService } from '@utils/';
import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsRelations, Repository } from 'typeorm';
import { Order, OrderStatus, PaymentStatus } from '../entities/Order.entity';
import { MenuService } from 'src/modules/menus/services/menu.service';
import { Menu } from 'src/modules/menus/entities/menu.entity';
import { NotificationService } from 'src/modules/notification/services/notification.service';
import { NotificationFor, NotificationType } from 'src/modules/notification/entities/notification.entity';
import { StreamNotificationsGateway } from 'src/modules/web-socket/services/stream-data';

@Injectable()
export class OrderService extends CrudService<Order> {
  constructor(
    @InjectRepository(Order)
    private orderRepo: Repository<Order>,
    @Inject(forwardRef(() => MenuService))
    private menuService: MenuService,
    @Inject(forwardRef(() => NotificationService))
    private notificationService: NotificationService,
    private streamNotificationsGateway: StreamNotificationsGateway,

  ) {
    super(orderRepo);
  }

  async populate(dto) {
    return {
      ...dto,
    };
  }

  getFindAllRelations(): FindOptionsRelations<Order> {
    return {
      company:true,
      payment:true,
      user:true
    }
  }

  getFindOneRelations(): FindOptionsRelations<Order> {
    return {
      company: true,
      payment: true,
      user:true
    }
  }

  async changeStatus(id:number,dto){
    await this.orderRepo.update(id, {
      status: dto.status,
    });
  
    const order = await this.findOneById(id);
  
    if (order.status === OrderStatus.Completed) {
      await this.orderRepo.update(id, {
        paymentStatus: PaymentStatus.Paid,
      });
    }
  
   const notif = await this.notificationService.createNotification({
     description: `Your Order status has been updated as ${order.status}`,
     user: order.user,
     company: order.company,
     notificationType: NotificationType.orderStatusChange,
     notificationFor: NotificationFor.clientNotifications,
     readed:false
   });
   this.streamNotificationsGateway.brodcastManagerNotification(
     `${order.user.id}-${order.company.id}`,
     notif,
   );
   return order;
 }
}
