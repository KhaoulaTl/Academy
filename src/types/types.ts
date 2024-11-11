export interface ParentType {
  _id: string;
  firstName: string;
  lastName: string;
  phone1: string;
  phone2: string;
  childIds: string[];
  }
  
  export interface CoachType {
    _id: string;
    firstName: string;
    lastName: string;
    phone: string;
    ageCategory: string[];
    playerIds: string[];
  }
  
  export interface CategoryType {
    _id: string;
    name: string;
    birthYears: number[];
    isActive: boolean;
  }


  export interface PlayerType {
    _id: string;
    firstName: string;
    lastName: string;
    birthDate: Date | null;
    parentId: string;
    coachId: string;
    skillLevel: string;
  }

  export interface EventType {
    _id: string;
    name: string;
    date: Date;
    location: string;
  }


  export interface TransactionType {
    _id: string;
    playerId: string; 
    subscriptionType: string;
    durationInMonths: number;
    amountPaid: number;
    paymentDate: Date;
    invoiceNumber: string;
    paymentStatus: string;
    dueDate: Date;
    insurancePaid: boolean; 
    insuranceAmount: number;
    insurancePaymentDate: Date; 
    paymentHistory: { amount: number; date: Date }[];
  }