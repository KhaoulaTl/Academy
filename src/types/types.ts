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