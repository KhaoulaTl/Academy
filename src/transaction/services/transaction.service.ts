/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prettier/prettier */
import { Injectable, NotFoundException, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Transaction } from '../schemas/transaction.schema';
import { Notification } from 'src/notification/schemas/notification.schema';
import { Player } from 'src/player/schemas/palyer/palyer.schema';

@Injectable()
export class TransactionService implements OnModuleInit, OnModuleDestroy {
  private intervalId: NodeJS.Timeout;

  constructor(
    @InjectModel(Transaction.name) private readonly transactionModel: Model<Transaction>,
    @InjectModel(Notification.name) private readonly notificationModel: Model<Notification>,
    @InjectModel('Player') private readonly playerModel: Model<Player>, 
  ) {}

  // Déclenché automatiquement au démarrage du module
  onModuleInit() {
    this.intervalId = setInterval(async () => {
      await this.executePeriodicOverdueCheck();
    }, 24 * 60 * 60 * 1000); // Exécution toutes les 24 heures
  }

  // Nettoyage pour éviter les fuites de mémoire
  onModuleDestroy() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  // Méthode pour exécuter l'opération périodique
  private async executePeriodicOverdueCheck() {
    const players = await this.playerModel.find().exec(); // Récupérer tous les joueurs
    for (const player of players) {
      await this.testOverduePayments(player.id); // Vérifier les paiements en retard pour chaque joueur
    }
  }

  async createTransaction(
    playerId: string,
    subscriptionType: string,
    durationInMonths: number,
    amountPaid: number,
    invoiceNumber: string,
    insuranceAmount: number,
    insurancePaid: boolean,
    insurancePaymentDate: Date,
    PaymentDate: Date,
  ): Promise<Transaction> {
    
    const dueDate = this.calculateDueDate(PaymentDate, durationInMonths);
    
    // La transaction est "Payée" si un paiement a eu lieu, sinon "Impayée"
    const paymentStatus = amountPaid > 0 ? 'Payé' : 'Impayé';  // Premier paiement
  
    const transaction = new this.transactionModel({
      playerId,
      subscriptionType,
      durationInMonths,
      amountPaid,
      paymentStatus,
      invoiceNumber,
      insuranceAmount,
      insurancePaid,
      paymentHistory: [{ amount: amountPaid, date: PaymentDate, invoiceNumber }], // Historique avec le paiement initial
      PaymentDate: new Date(PaymentDate).toISOString(),
      insurancePaymentDate: new Date(insurancePaymentDate).toISOString(),
      dueDate: this.calculateDueDate(new Date(PaymentDate), durationInMonths),
  });
    return await transaction.save();
  }
  

  async getTransactionHistory(playerId: string): Promise<Transaction[]> {
    return this.transactionModel.find({ playerId }).exec();
  }

  async createPayment(
    playerId: string,
    amount: number,
    invoiceNumber: string,
    insurancePayment: boolean,
    newDurationInMonths?: number,
    newSubscriptionType?: string 
  ): Promise<Transaction> {
    const transaction = await this.transactionModel.findOne({ playerId }).sort({ lastPaymentDate: -1 });
  
    if (!transaction) {
      throw new NotFoundException('Transaction not found for this player.');
    }
  
    // Ajout du paiement à l'historique
    transaction.paymentHistory.push({ amount, date: new Date(), invoiceNumber });
    transaction.amountPaid += amount;
    transaction.PaymentDate = new Date();
  
    // Si un paiement est effectué, mettez à jour le statut
    if (transaction.amountPaid > 0) {
      transaction.paymentStatus = 'Payé';
    }

    // Mise à jour du type d'abonnement si fourni
    if (newSubscriptionType) {
      transaction.subscriptionType = newSubscriptionType;
    }
  
    // Si une nouvelle durée est spécifiée, mettez-la à jour et recalculer la date d'échéance
    if (newDurationInMonths) {
      transaction.durationInMonths = newDurationInMonths;
    }
  
    // Recalculer la date d'échéance en fonction de la durée (ancienne ou nouvelle)
    transaction.dueDate = this.calculateDueDate(transaction.PaymentDate, transaction.durationInMonths);
  
    return await transaction.save();
  }
  
  
  
  
  async getAllTransactions(): Promise<Transaction[]> {
    return this.transactionModel.find().exec(); 
  }

  private calculateDueDate(startDate: Date, monthsToAdd: number): Date {
    const dueDate = new Date(startDate);
  
    // Ajouter les mois à la date de départ
    dueDate.setMonth(dueDate.getMonth() + monthsToAdd);
  
    // S'assurer que les dates comme "31 janvier + 1 mois" aboutissent au dernier jour de février
    if (dueDate.getDate() < startDate.getDate()) {
      dueDate.setDate(0); // Défini le dernier jour du mois précédent
    }
  
    return dueDate;
  }
  
// Méthode existante pour tester les paiements en retard pour un joueur
  async testOverduePayments(playerId: string) {
    const transaction = await this.transactionModel.findOne({ playerId });
    if (transaction) {
      transaction.dueDate = new Date(Date.now() - 86400000); // Date dépassée
      transaction.paymentStatus = 'Impayé';
      await transaction.save();

      const player = await this.playerModel.findById(transaction.playerId).populate('parentId');
      if (player && player.parentId) {
        const parent = player.parentId as any;
        await this.createNotification(transaction, player, parent);
      }
    }
  }

  private async createNotification(transaction: Transaction, player: Player, parent: any) {
    const notification = new this.notificationModel({
      playerId: player._id,
      parentId: parent._id,
      dueDate: transaction.dueDate,
      message: `Le paiement pour ${player.firstName} ${player.lastName} est en retard. Veuillez régulariser.`,
      details: {
        playerName: `${player.firstName} ${player.lastName}`,
        parentName: `${parent.firstName} ${parent.lastName}`,
      },
      createdAt: new Date(),
      status: 'non-lu',
    });

    await notification.save();
  }
  
}
