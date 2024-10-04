/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { AdminModule } from './admin/admin.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';
import { ParentModule } from './parent/parent.module';
import { PlayerModule } from './player/player.module';
import { CoachModule } from './coach/coach.module';
import { CategoryModule } from './category/category.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `.env.local`,
      isGlobal: true,
    }),
    MongooseModule.forRoot('mongodb://127.0.0.1:27017/academy'),
    HttpModule, 
    AuthModule,
    AdminModule,
    ParentModule,
    PlayerModule,
    CoachModule,
    CategoryModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
