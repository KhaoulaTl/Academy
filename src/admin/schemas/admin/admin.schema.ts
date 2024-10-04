/* eslint-disable prettier/prettier */
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument} from 'mongoose';
import { Role } from 'src/auth/config/enum/role.enum';

export type AdminDocument = HydratedDocument<Admin>;

@Schema()
export class Admin {

  @Prop({ required: true })
  firstName: string;

  @Prop({ required: true })
  lastName: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true })
  role: Role[];
    save: any;
}

export const AdminSchema = SchemaFactory.createForClass(Admin);
