/* eslint-disable prettier/prettier */
import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { Parent } from 'src/parent/schemas/parent/parent.schema';
import { ParentService } from 'src/parent/services/parent/parent.service';
import { Player } from 'src/player/schemas/palyer/palyer.schema';

@Controller('parents')
export class ParentController {
  constructor(private readonly parentService: ParentService) {}

  // Create a new parent
  @Post()
  async create(@Body() createParentDto: Partial<Parent>): Promise<Parent> {
    return this.parentService.create(createParentDto);
  }

  // Get all parents
  @Get()
  async findAll(): Promise<Parent[]> {
    return this.parentService.findAll();
  }

  // Get a parent by ID
  @Get(':id')
  async findById(@Param('id') id: string): Promise<Parent> {
    return this.parentService.findById(id);
  }

  // Update a parent by ID
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateParentDto: Partial<Parent>,
  ): Promise<Parent> {
    return this.parentService.update(id, updateParentDto);
  }

  // Delete a parent by ID
  @Delete(':id')
  async delete(@Param('id') id: string): Promise<void> {
    return this.parentService.delete(id);
  }

  // Get players by parent ID
  @Get(':id/players')
  async findPlayersByParent(@Param('id') id: string): Promise<Player[]> {
    return this.parentService.findPlayersByParent(id);
  }
}
