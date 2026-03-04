export interface Review {
    id: string;
    rating: number;
    comment?: string;
    customerId: string;
    branchId?: string;
    menuItemId?: string;
    orderId?: string;
    createdAt: Date;
    updatedAt: Date;
}
