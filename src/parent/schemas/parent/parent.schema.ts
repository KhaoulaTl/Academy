/* eslint-disable prettier/prettier */
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Parent extends Document {
  @Prop({ required: true })
  firstName: string;

  @Prop({ required: true })
  lastName: string;

  @Prop({ required: true })
  phone1: string;

  @Prop()
  phone2?: string;

  @Prop([{ type: String, ref: 'Player' }])
  childIds: string[];
}

export const ParentSchema = SchemaFactory.createForClass(Parent);
