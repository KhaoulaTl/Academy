/* eslint-disable prettier/prettier */

import { Controller, Get, Post, Body, Param, Put, Delete, Query } from '@nestjs/common';
import { Coach } from 'src/coach/schemas/coach/coach.schema';
import { CoachService } from 'src/coach/services/coach/coach.service';

@Controller('coaches')
export class CoachController {
  constructor(private readonly coachService: CoachService) {}

  @Post()
  create(@Body() createCoachDto: any): Promise<Coach> {
    return this.coachService.create(createCoachDto);
  }

  @Get()
  findAll(): Promise<Coach[]> {
    return this.coachService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Coach> {
    return this.coachService.findOne(id);
  }

  @Get('age')
  findByAge(@Query('ageCategory') ageCategory: string): Promise<Coach[]> {
    return this.coachService.findByAge(ageCategory);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateCoachDto: any): Promise<Coach> {
    return this.coachService.update(id, updateCoachDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<Coach> {
    return this.coachService.remove(id);
  }
}
