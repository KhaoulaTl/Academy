/* eslint-disable prettier/prettier */

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Category extends Document {
  @Prop({ required: true })
  name: string; // e.g., "2001 Only", "2002 Only", "2003-2004", etc.

  @Prop({ type: [Number], required: true })
  birthYears: number[]; // List of birth years in this category, e.g., [2003, 2004]

  @Prop({ default: true })
  isActive: boolean; // To easily activate/deactivate a category
}

export const CategorySchema = SchemaFactory.createForClass(Category);
