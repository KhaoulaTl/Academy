/* eslint-disable prettier/prettier */
import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { Transaction } from '../schemas/transaction.schema';
import { TransactionService } from '../services/transaction.service';

@Controller('transactions')
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @Post()
  async createTransaction(
    @Body('playerId') playerId: string,
    @Body('subscriptionType') subscriptionType: string,
    @Body('durationInMonths') durationInMonths: number,
    @Body('amountPaid') amountPaid: number,
  ): Promise<Transaction> {
    return this.transactionService.createTransaction(playerId, subscriptionType, durationInMonths, amountPaid);
  }

  @Get(':playerId')
  async getTransactionHistory(@Param('playerId') playerId: string): Promise<Transaction[]> {
    return this.transactionService.getTransactionHistory(playerId);
  }

  @Post('pay')
  async payTransaction(@Body() body: { playerId: string; amount: number }) {
    return await this.transactionService.createPayment(body.playerId, body.amount);
  }
}

