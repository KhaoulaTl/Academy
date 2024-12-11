/* eslint-disable prettier/prettier */
export interface ITransaction {
    _id?: number;
    playerId: string; 
    subscriptionType: string;
    durationInMonths: number;
    amountPaid: number;
    PaymentDate: Date;
    invoiceNumber: string;
    paymentStatus: string;
    dueDate: Date;
    insurancePaid: boolean; 
    insuranceAmount: number;
    insurancePaymentDate: Date; 
    paymentHistory: { amount: number; date: Date, invoiceNumber: string }[];
}
