/* eslint-disable prettier/prettier */
export interface IParent {
    _id?: number;
    firstName: string;
    lastName: string;
    phone1: string;
    phone2?: string;
    childIds: string[];
  }
  