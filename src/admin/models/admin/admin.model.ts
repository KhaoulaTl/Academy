/* eslint-disable prettier/prettier */
export interface IAdmin {
  _id?: number;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  newPassword?: string;
  role: string;
}
