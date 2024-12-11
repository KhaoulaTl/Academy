/* eslint-disable prettier/prettier */
import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Notification extends Document {
  
  @Prop({ required: true })
  playerId: string; // Identifiant du joueur

  @Prop({ required: true })
  parentId: string; // Identifiant du parent

  @Prop({ required: true })
  dueDate: Date; // Date d’échéance

  @Prop({ default: false })
  isRead: boolean; // Statut de lecture par l'administrateur

  @Prop({
    type: Object,
    default: {},
  })
  details: {
    playerName: string; // Nom complet du joueur
    parentName: string; // Nom complet du parent
  };
}

export const NotificationSchema = SchemaFactory.createForClass(Notification);
