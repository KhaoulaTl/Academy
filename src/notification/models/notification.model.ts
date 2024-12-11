/* eslint-disable prettier/prettier */

export interface INotification {
_id:string;
playerId: string;
parentId: string;
dueDate: Date; 
isRead: boolean;
details: {
    playerName: string; // Nom complet du joueur
    parentName: string; // Nom complet du parent
  };
}