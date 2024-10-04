/* eslint-disable prettier/prettier */

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Coach extends Document {
  @Prop({ required: true })
  firstName: string;

  @Prop({ required: true })
  lastName: string;

  @Prop({ required: true })
  phone: string;

  @Prop([{ type: String, ref: 'Category' }])
  ageCategory: string[];

  @Prop([{ type: String, ref: 'Player' }])
  playerIds: string[];

}

export const CoachSchema = SchemaFactory.createForClass(Coach);
