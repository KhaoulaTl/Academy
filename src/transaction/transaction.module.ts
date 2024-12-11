/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { TransactionService } from './services/transaction.service';
import { TransactionController } from './controllers/transaction.controller';
import { Transaction, TransactionSchema } from './schemas/transaction.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { NotificationModule } from 'src/notification/notification.module';
import { Player, PlayerSchema } from 'src/player/schemas/palyer/palyer.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Transaction.name, schema: TransactionSchema },
      { name: Player.name, schema: PlayerSchema },
    ]),
    NotificationModule,
  ],
  providers: [TransactionService],
  controllers: [TransactionController],
  exports: [TransactionService],
})
export class TransactionModule {}
