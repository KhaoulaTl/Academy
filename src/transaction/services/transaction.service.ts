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
    }, 4 * 60 * 60 * 1000); // Exécution toutes les 24 heures
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
      paymentHistory: [{ amount: amountPaid, date: PaymentDate, invoiceNumber, dueDate }], // Historique avec le paiement initial
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
  
    // Calculer la nouvelle date d'échéance
    const updatedDueDate = this.calculateDueDate(transaction.dueDate, transaction.durationInMonths);

    // Ajout du paiement à l'historique
    transaction.paymentHistory.push({ amount, date: new Date(), invoiceNumber, dueDate: updatedDueDate  });
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
private async testOverduePayments(playerId: string) {
  // Récupérer toutes les transactions pour ce joueur
  const transactions = await this.transactionModel.find({ playerId }).exec();

  for (const transaction of transactions) {
    console.log(`Vérification de la transaction : ${transaction._id}`);

    // Convertir la date d'échéance et la comparer avec la date actuelle
    const today = new Date();
    const dueDate = new Date(transaction.dueDate);

    // Si la date d'échéance est dépassée ET que le paiement est marqué comme "Payé"
    if (dueDate < today && transaction.paymentStatus === 'Payé') {
      console.log(`Paiement en retard détecté pour la transaction ${transaction._id}`);

      // Mise à jour du statut de la transaction
      transaction.paymentStatus = 'Impayé';
      await transaction.save();
      console.log(`Statut mis à jour pour la transaction ${transaction._id}`);

      // Vérifier le joueur associé et envoyer une notification
      const player = await this.playerModel.findById(playerId).populate('parentId').exec();
      if (player && player.parentId) {
        await this.createNotification(transaction, player, player.parentId);
      }
    } else {
      // Si la date n'est pas dépassée, aucune action à prendre
      console.log(`Aucune mise à jour nécessaire pour la transaction ${transaction._id}`);
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

  async deleteTransaction(id: string) : Promise<void> {
    const result = await this.transactionModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException(`Transaction with id ${id} not found`);
    }
  }

  async calculateRevenueByPeriod(period: 'day' | 'week' | 'month'): Promise<number> {
    const transactions = await this.transactionModel.find().exec();
    
    const now = new Date();
    let startDate: Date;
    
    // Déterminer la date de début en fonction de la période
    if (period === 'day') {
      startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate()); // Début de la journée
    } else if (period === 'week') {
      const firstDayOfWeek = now.getDate() - now.getDay(); // Dimanche précédent
      startDate = new Date(now.getFullYear(), now.getMonth(), firstDayOfWeek); // Lundi de la semaine
    } else if (period === 'month') {
      startDate = new Date(now.getFullYear(), now.getMonth(), 1); // Premier jour du mois
    } else {
      throw new Error('Invalid period. Allowed values: day, week, month.');
    }
    
    let totalRevenue = 0;
    
    // Parcourir chaque transaction et son historique des paiements
    for (const transaction of transactions) {
      for (const payment of transaction.paymentHistory) {
        const paymentDate = new Date(payment.date);
        
        // Vérifier si le paiement est dans la plage de dates
        if (paymentDate >= startDate && paymentDate <= now) {
          // Convertir le montant en nombre en gérant le typage
          const paymentAmount = typeof payment.amount === 'string' ? parseFloat(payment.amount) : payment.amount;
          
          // Calculer le revenu en fonction de la période
          if (period === 'day' && paymentDate.getDate() === now.getDate()) {
            totalRevenue += paymentAmount;
          } else if (period === 'week' && paymentDate >= startDate && paymentDate <= now) {
            totalRevenue += paymentAmount;
          } else if (period === 'month' && paymentDate.getMonth() === now.getMonth() && paymentDate.getFullYear() === now.getFullYear()) {
            totalRevenue += paymentAmount;
          }
        }
      }
    }
  
    return totalRevenue;
  }
  
}
