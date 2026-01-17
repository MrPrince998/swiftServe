import { Address } from './address.interface';
import { BillingSubscription } from './subscription.interface';

export interface User {
  id: string;
  imageUrl?: string;
  fullName: string;
  email: string;
  isEmailVerified: boolean;
  otp?: string;
  otpExpiry?: Date;
  phoneNumber?: string;
  password: string;
  role: userRole;
  address: Address;
  isEmployed: boolean;
  employeeID?: string;
  restaurantId?: string;
  isSubscribed: boolean;
  subscriptionId?: BillingSubscription;
  notificationIds?: string[];
  twoFactorEnabled: boolean;
  resetPasswordToken?: string | null;
  resetPasswordExpires?: Date | null;
  isPushNotificationsEnabled: boolean;
  isEmailNotificationsEnabled: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export enum userRole {
  SUPER_ADMIN = 'SUPER_ADMIN',
  ADMIN = 'ADMIN',
  MANAGER = 'MANAGER',
  RECEPTIONIST = 'RECEPTIONIST',
  WAITER = 'WAITER',
  USER = 'USER',
}
