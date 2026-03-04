import { User } from "./user.interface";

export interface Notification {
    id: string;
    message: string;
    senderId: User;
    receiverId: User;
    isRead: boolean;
    branchId: string;
    tableId: string;
    foodMenuId: string;
    orderId: string;
    createdAt: Date;
    updatedAt: Date;
}