/* eslint-disable prettier/prettier */
import { Controller, Post, Body, Get, Param, Delete } from '@nestjs/common';
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
    @Body('invoiceNumber') invoiceNumber: string,
    @Body('insuranceAmount') insuranceAmount: number,
    @Body('insurancePaid') insurancePaid: boolean,
    @Body('PaymentDate') PaymentDate: string,  // Utilisation d'un string au lieu de Date
    @Body('insurancePaymentDate') insurancePaymentDate: string  // Utilisation d'un string au lieu de Date
  ): Promise<Transaction> {
    // Conversion des dates de type string vers Date
    const paymentDate = new Date(PaymentDate);
    const insuranceDate = new Date(insurancePaymentDate);

    return this.transactionService.createTransaction(
      playerId,
      subscriptionType,
      durationInMonths,
      amountPaid,
      invoiceNumber,
      insuranceAmount,
      insurancePaid,
      paymentDate,
      insuranceDate
    );
  }

  @Get(':playerId')
  async getTransactionHistory(@Param('playerId') playerId: string): Promise<Transaction[]> {
    return this.transactionService.getTransactionHistory(playerId);
  }

  @Post('pay')
async payTransaction(
  @Body() body: { 
    playerId: string; 
    amount: number; 
    invoiceNumber: string; 
    insurancePayment?: boolean; 
    newDurationInMonths?: number;
    newSubscriptionType?: string; // Nouvelle durée optionnelle
  }
) {
  return await this.transactionService.createPayment(
    body.playerId, 
    body.amount, 
    body.invoiceNumber, 
    body.insurancePayment ?? false,
    body.newDurationInMonths,
    body.newSubscriptionType
  );
}


  @Get() 
  async getAllTransactions(): Promise<Transaction[]> {
    return this.transactionService.getAllTransactions();
  }

 // @Get('test-overdue/:playerId')
//async testOverduePayments(@Param('playerId') playerId: string) {
 // await this.transactionService.testOverduePayments(playerId); // Déléguez au service
 // return { message: 'Test terminé.' };
//}

@Delete(':id')
async remove(@Param('id') id: string): Promise<void>{
  return this.transactionService.deleteTransaction(id);
}

@Get('revenue/:period')
async getRevenueByPeriod(@Param('period') period: 'day' | 'week' | 'month'): Promise<{ period: string, totalRevenue: number }> {
  const totalRevenue = await this.transactionService.calculateRevenueByPeriod(period);
  return { period, totalRevenue };
}



}
