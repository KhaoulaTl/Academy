/* eslint-disable prettier/prettier */

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
@Injectable()
export class EventService {
  constructor(@InjectModel(Event.name) private readonly eventModel: Model<Event>) {}

  async create(createEventDto: any): Promise<Event> {
    const newEvent = new this.eventModel(createEventDto);
    return newEvent.save();
  }

  async findAll(): Promise<Event[]> {
    return this.eventModel.find().exec();
  }

  async findOne(id: string): Promise<Event> {
    const event = await this.eventModel.findById(id).exec();
    if (!event) {
      throw new NotFoundException(`Event #${id} not found`);
    }
    return event;
  }

  async update(id: string, updateEventDto: any): Promise<Event> {
    const updatedEvent = await this.eventModel.findByIdAndUpdate(id, updateEventDto, { new: true }).exec();
    if (!updatedEvent) {
      throw new NotFoundException(`Event #${id} not found`);
    }
    return updatedEvent;
  }

  async remove(id: string): Promise<void> {
    if (!id) {
      throw new Error('Event ID is required');
    }
    const result = await this.eventModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException(`Event #${id} not found`);
    }
  }
}
