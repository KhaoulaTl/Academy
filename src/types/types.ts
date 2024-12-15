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
    ageCategory: string;
    _id: string;
    firstName: string;
    lastName: string;
    birthDate: Date | null;
    parentId: string;
    coachId: string;
    skillLevel: string;
    categoryId: string;
    
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
    PaymentDate: Date;
    invoiceNumber: string;
    paymentStatus: string;
    dueDate: Date;
    insurancePaid: boolean; 
    insuranceAmount: number;
    insurancePaymentDate: Date; 
    paymentHistory: { amount: number; date: Date; invoiceNumber: string; }[];
  }

  export interface NotificationType {
    _id: string;
    playerId: string;
    parentId: string;
    dueDate: Date;
    isRead: boolean;
    details: {
      playerName: string; // Nom complet du joueur
      parentName: string; // Nom complet du parent
    };
  }