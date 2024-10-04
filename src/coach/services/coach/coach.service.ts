/* eslint-disable prettier/prettier */

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Coach } from 'src/coach/schemas/coach/coach.schema';

@Injectable()
export class CoachService {
  constructor(
    @InjectModel(Coach.name) private readonly coachModel: Model<Coach>,
  ) {}

  async create(createCoachDto: any): Promise<Coach> {
    const createdCoach = new this.coachModel(createCoachDto);
    return createdCoach.save();
  }

  async findAll(): Promise<Coach[]> {
    return this.coachModel.find().exec();
  }

  async findOne(id: string): Promise<Coach> {
    return this.coachModel.findById(id).exec();
  }

  async findByAge(ageCategory: string): Promise<Coach[]> {
    return this.coachModel.find({ ageCategory }).exec();
  }

  async update(id: string, updateCoachDto: any): Promise<Coach> {
    return this.coachModel.findByIdAndUpdate(id, updateCoachDto, { new: true }).exec();
  }

  async remove(id: string): Promise<Coach> {
    return this.coachModel.findByIdAndDelete(id).exec();
  }
  
}

