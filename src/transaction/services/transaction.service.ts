/* eslint-disable prettier/prettier */
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Transaction } from '../schemas/transaction.schema';

@Injectable()
export class TransactionService {
  constructor(@InjectModel(Transaction.name) private readonly transactionModel: Model<Transaction>) {}

  async createTransaction(playerId: string, subscriptionType: string, durationInMonths: number, amountPaid: number): Promise<Transaction> {
    const invoiceNumber = `FACT-${Date.now()}`; // Générer un numéro de facture unique
    const transaction = new this.transactionModel({
      playerId,
      subscriptionType,
      durationInMonths,
      amountPaid,
      lastPaymentDate: new Date(),
      invoiceNumber,
      paymentStatus: 'Payé',
      dueDate: new Date(new Date().setMonth(new Date().getMonth() + 1)), // Date d'échéance pour le mois suivant
      paymentHistory: [{ amount: amountPaid, date: new Date() }],
    });

    return await transaction.save();
  }

  async getTransactionHistory(playerId: string): Promise<Transaction[]> {
    return this.transactionModel.find({ playerId }).exec();
  }

  async createPayment(playerId: string, amount: number): Promise<Transaction> {
    const transaction = await this.transactionModel.findOne({ playerId }).sort({ lastPaymentDate: -1 });

    if (!transaction) {
      throw new NotFoundException('Transaction not found for this player.');
    }

    // Mettre à jour l'historique des paiements
    transaction.paymentHistory.push({
      amount,
      date: new Date(),
    });

    // Mettre à jour les informations de paiement
    transaction.amountPaid += amount;  // Somme des paiements cumulés
    transaction.lastPaymentDate = new Date();
    transaction.dueDate = new Date(new Date().setMonth(new Date().getMonth() + 1)); // Nouvelle date d'échéance

    return await transaction.save();
  }
}
