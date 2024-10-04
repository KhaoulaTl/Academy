/* eslint-disable prettier/prettier */
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Parent } from 'src/parent/schemas/parent/parent.schema';
import { Player } from 'src/player/schemas/palyer/palyer.schema';

@Injectable()
export class ParentService {
  constructor(
    @InjectModel(Parent.name) private readonly parentModel: Model<Parent>,
    @InjectModel(Player.name) private readonly playerModel: Model<Player>,
  ) {}

  // Create a new parent
  async create(createParentDto: any): Promise<Parent> {
    const newParent = new this.parentModel(createParentDto);
    return newParent.save();
  }

  // Find all parents
  async findAll(): Promise<Parent[]> {
    return this.parentModel.find().exec();
  }

  // Find a parent by ID
  async findById(id: string): Promise<Parent> {
    const parent = await this.parentModel.findById(id).exec();
    if (!parent) {
      throw new NotFoundException(`Parent with ID ${id} not found`);
    }
    return parent;
  }

  // Update a parent by ID
  async update(id: string, updateParentDto: any): Promise<Parent> {
    const updatedParent = await this.parentModel
      .findByIdAndUpdate(id, updateParentDto, { new: true })
      .exec();
    if (!updatedParent) {
      throw new NotFoundException(`Parent with ID ${id} not found`);
    }
    return updatedParent;
  }

  // Delete a parent by ID
  async delete(id: string): Promise<void> {
    const result = await this.parentModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException(`Parent with ID ${id} not found`);
    }
  }

  // Find players by parent ID
  async findPlayersByParent(parentId: string): Promise<Player[]> {
    const parent = await this.parentModel.findById(parentId).exec();
    if (!parent) {
      throw new NotFoundException(`Parent with ID ${parentId} not found`);
    }
    if (!parent.childIds.length) {
      return [];
    }
    return this.playerModel.find({ _id: { $in: parent.childIds } }).exec();
  }
  
}
