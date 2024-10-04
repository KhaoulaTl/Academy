/* eslint-disable prettier/prettier */

import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Parent, ParentSchema } from './schemas/parent/parent.schema';
import { ParentService } from './services/parent/parent.service';
import { ParentController } from './controllers/parent/parent.controller';
import { Player, PlayerSchema } from 'src/player/schemas/palyer/palyer.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Parent.name, schema: ParentSchema },
      { name: Player.name, schema: PlayerSchema },
    ]),
  ],
  providers: [ParentService],
  controllers: [ParentController],
  exports: [ParentService],
})
export class ParentModule {}
