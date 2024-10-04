/* eslint-disable prettier/prettier */

export interface ICoach {
    _id?: number;
    firstName: string;
    lastName: string;
    phone: string;
    ageCategory: string[];
    playerIds: string[];
}