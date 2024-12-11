/* eslint-disable prettier/prettier */
import { Controller, Delete, Get, NotFoundException, Param } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Notification } from '../schemas/notification.schema';

@Controller('notifications')
export class NotificationController {
  constructor(
    @InjectModel(Notification.name)
    private readonly notificationModel: Model<Notification>,

  ) {}
  

  @Get()
  async getAllNotifications() {
    return await this.notificationModel.find().sort({ dueDate: -1 }); // Retourne toutes les notifications triées par date
  }

  @Delete(':id')
  async deleteNotification(@Param('id') id: string) {
    const notification = await this.notificationModel.findById(id);
    if (!notification) {
      throw new NotFoundException(`Notification with ID ${id} not found`);
    }
    await this.notificationModel.findByIdAndDelete(id);
    return { message: 'Notification deleted successfully' };
  }
  
}
