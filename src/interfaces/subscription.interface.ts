export interface BillingSubscription {
  id: string;
  subscriptionPlanDetailsID: string;
  subscriptionStartDate: Date;
  subscriptionEndDate: Date;
  purchaseHistory: PurchaseHistory[];
  isActive: boolean;
  isOnTrial: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export enum SubscriptionPlan {
  PRO = 'pro',
  PROFESSIONAL = 'professional',
  ENTERPRISE = 'enterprise',
}

export interface SubscriptionPlanDetails {
  id: string;
  subscriptionPlan: SubscriptionPlan;
  pricePerMonth: number;
  pricePerYear: number;
  features: string[];
}

export interface PurchaseHistory {
  id: string;
  subscriptionID: string;
  purchaseDate: Date;
  amountPaid: number;
  paymentMethod: string;
  transactionId: string;
}
