export interface Restaurant {
  id: string;
  restaurantName: string;
  websiteUrl?: string;
  restaurantEmail: string;
  restaurantPhone?: string;
  restaurantAddress: string;
  restaurantLogoURL?: string;
  restaurantStatus: restaurantStatus;
  branchIds: string[];
  planIds?: string;
  planStartDate?: Date;
  planEndDate?: Date;
  subscriptionStatus?: string;
  subscriptionId?: string;
  maxUsers?: number;
  VATNumber?: string;
  registrationNumber?: string;
  settings?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

export enum restaurantStatus {
  TRIAL = 'trial',
  ACTIVE = 'active',
  EXPIRED = 'expired',
  SUSPENDED = 'suspended',
}
