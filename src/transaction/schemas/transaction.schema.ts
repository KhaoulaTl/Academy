/* eslint-disable prettier/prettier */
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Transaction extends Document {
  @Prop({ type: String, ref: 'Player', required: true })
  playerId: string;  // Référence au joueur sous forme de chaîne

  @Prop({ required: true })
  subscriptionType: string;  // Type d'abonnement (ex: 'Mensuel', '6 mois', '10 mois')

  @Prop({ required: true })
  durationInMonths: number;  // Durée de l'abonnement en mois (1, 6, 10)

  @Prop({ required: true })
  amountPaid: number;  // Montant payé

  @Prop({ required: true })
  lastPaymentDate: Date;  // Date du paiement

  @Prop({ required: true, unique: true })
  invoiceNumber: string;  // Numéro de facture unique

  @Prop({ required: true })
  paymentStatus: string;  // État du paiement (ex: 'Payé', 'Impayé', 'En attente')

  @Prop({ required: true })
  dueDate: Date;  // Date d'échéance du paiement

  @Prop({ default: false })
  insurancePaid: boolean;  // Indique si l'assurance a été payée pour l'année

  @Prop()
  insuranceAmount: number;  // Montant de l'assurance annuelle

  @Prop()
  insurancePaymentDate: Date;  // Date de paiement de l'assurance (devrait être chaque septembre)

  @Prop({ default: [] })
  paymentHistory: { amount: number; date: Date }[];  // Historique des paiements
}

export const TransactionSchema = SchemaFactory.createForClass(Transaction);
