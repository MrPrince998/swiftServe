import { userRole } from '@interfaces/user.interface';
import { Expose, Exclude } from 'class-transformer';
export class UserResponseDto {
  @Expose()
  id: string;

  @Expose()
  username: string;

  @Expose()
  email: string;

  @Expose()
  phoneNumber?: string;

  @Exclude()
  password: string;

  @Expose()
  role: userRole;

  @Expose()
  imageUrl?: string;

  @Expose()
  addressId: string;

  @Expose()
  isEmployed: boolean;

  @Expose()
  employeeID?: string;

  @Expose()
  restaurantId?: string;

  @Expose()
  isSubscribed: boolean;

  @Expose()
  subscriptionId?: string;

  @Expose()
  notificationIds?: string[];

  @Expose()
  isEmailVerified: boolean;

  @Expose()
  twoFactorEnabled: boolean;

  @Expose()
  isPushNotificationsEnabled: boolean;

  @Expose()
  isEmailNotificationsEnabled: boolean;

  @Exclude()
  isUserDeleted: boolean;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;
}
