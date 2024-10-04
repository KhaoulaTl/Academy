/* eslint-disable prettier/prettier */

// coach.module.ts
import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Coach, CoachSchema } from './schemas/coach/coach.schema'; 
import { CoachController } from './controllers/coach/coach.controller';
import { CoachService } from './services/coach/coach.service';
import { CategoryModule } from 'src/category/category.module';
import { PlayerModule } from 'src/player/player.module'; // Import PlayerModule

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Coach.name, schema: CoachSchema }]),
    CategoryModule,
    forwardRef(() => PlayerModule), // Use forwardRef to avoid circular dependency
  ],
  controllers: [CoachController],
  providers: [CoachService], 
  exports: [CoachService],
})
export class CoachModule {}