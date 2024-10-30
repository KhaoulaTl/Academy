/* eslint-disable prettier/prettier */
import { Role } from "src/auth/config/enum/role.enum";

export interface IAdmin {
  _id?: number;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  newPassword?: string;
  role: Role[];
}
