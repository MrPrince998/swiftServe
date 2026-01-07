import { Branch } from "./branch.interface";

export interface Restaurant {
    id: string;
    restaurantName: string;
    branchIds: Branch[];
    websiteUrl: string;
    restaurantEmail: string;
    restaurantPhone: string;
    restaurantAddress: string;
    restaurantLogo: string;
    restaurantStatus: restaurantStatus;
    restaurantUrl: string;
    VATNumber: string;
    registrationNumber: string;
    createdAt: Date;
    updatedAt: Date;
}

export enum restaurantStatus {
    ACTIVE = 'active',
    INACTIVE = 'inactive',
}