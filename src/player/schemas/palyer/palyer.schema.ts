/* eslint-disable prettier/prettier */
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Player extends Document {
  @Prop({ required: true })
  firstName: string;

  @Prop({ required: true })
  lastName: string;

  @Prop({ required: true })
  birthDate: Date;

  @Prop({ type: String, ref: 'Parent' })
  parentId: string;

  @Prop({ type: String, ref: 'Coach' })
  coachId: string;

  @Prop({ type: String, ref: 'Category' }) 
  categoryId: string;
  
  @Prop()
  skillLevel: string;
}

export const PlayerSchema = SchemaFactory.createForClass(Player);
