import { MenuItem } from "./branch.interface";

export interface Order {
    id: string;
    branchId: string;
    tableId: string;
    orderId: string;
    orderStatus: orderStatus;
    orderDate: Date;
    totalOrderAmount: number;
    orderItems: OrderItem[];
    createdAt: Date;
    updatedAt: Date;
}

export enum orderStatus {
    PENDING = 'pending',
    COMPLETED = 'completed',
    FAILED = 'failed',
}

export interface OrderItem {
    id: string;
    foodMenuId: MenuItem;
    quantity: number;
    createdAt: Date;
    updatedAt: Date;
}