/* eslint-disable prettier/prettier */

import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ParentModule } from '../parent/parent.module';  
import { Player, PlayerSchema } from './schemas/palyer/palyer.schema';
import { PlayerService } from './services/player/player.service';
import { PlayerController } from './controllers/player/player.controller';
import { CoachModule } from 'src/coach/coach.module';
import { CategoryModule } from 'src/category/category.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Player.name, schema: PlayerSchema }]),
    ParentModule,
    CoachModule, 
    CategoryModule, 
  ],
  providers: [PlayerService],
  controllers: [PlayerController],
  exports: [PlayerService]  
})
export class PlayerModule {}
