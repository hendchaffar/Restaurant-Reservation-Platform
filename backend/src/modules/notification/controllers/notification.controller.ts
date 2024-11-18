import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { NotificationService } from '../services/notification.service';
import { JwtAuthGuard } from 'src/modules/auth/guard/auth.guard';
import { ApiBearerAuth } from '@nestjs/swagger';
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@Controller('notifications')
export class NotificationController {
  constructor(private notificationService: NotificationService) {}

  @Get(':id')
  getNotificationsPerUser(@Param('id') id:string){
    return this.notificationService.findNotifPerUser(+id);
  }

  @Get('resetvisibility/:id')
  resetVisibilityOfNotifications(@Param('id') id:string){
    return this.notificationService.resetVisibilityOfNotifications(+id);
  }
}
