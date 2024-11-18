import { BaseEntity } from '@utils/';
import { Company } from 'src/modules/company/entities/company.entity';
import { User } from 'src/modules/users/entities/user.entity';
import { Column, Entity, ManyToOne } from 'typeorm';

export enum NotificationFor {
  clientNotifications = 'client notifications',
  managerNotifications = 'manager notifications',
  adminNotifications = 'admin notifications',
}
export enum NotificationType {
  app_management='app management',
  reservationStatusChange = 'ReservationStatusChange',
  orderStatusChange = 'OrderStatusChange',
}

@Entity()
export class Notification extends BaseEntity {
  @Column({
    type: 'varchar',
  })
  description: string;

  @Column({
    type: 'enum',
    enum: NotificationFor,
  })
  notificationFor: NotificationFor;

  @Column({
    type: 'enum',
    enum: NotificationType,
  })
  notificationType: NotificationType;

  @ManyToOne(() => Company)
  company: Company;

  @ManyToOne(() => User, (r) => r.notifications)
  user: User;

  @Column({
    type: 'boolean',
    default: false,
  })
  readed: boolean;

 
}
