import { userRole } from '@interfaces/user.interface';
import { BillingSubscription } from '@modules/billing-subscription/entities/billing-subscription.entity';
import {
  Column,
  Entity,
  OneToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { RestaurantBranch } from '@modules/restaurant-branch/entities/resturant-branch.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid') id: string;
  @Column() username: string;
  @Column({ unique: true }) email: string;
  @Column({ nullable: true, unique: true }) phoneNumber?: string;
  @Column() password: string;
  @Column({
    type: 'enum',
    enum: userRole,
    default: userRole.USER,
  })
  role: userRole;
  @Column({ nullable: true }) imageUrl?: string;
  @Column({ nullable: true }) addressId: string;
  @Column({ default: false }) isEmployed: boolean;
  @Column({ nullable: true }) employeeID?: string;
  @OneToMany(() => RestaurantBranch)
  restaurantBranch?: string;
  @Column({ default: false }) isSubscribed: boolean;

  @Column({ nullable: true })
  subscriptionId?: string;

  @OneToOne(() => BillingSubscription, (subscription) => subscription.user)
  subscription?: BillingSubscription;

  @Column({ type: 'simple-array', nullable: true }) notificationIds?: string[];
  @Column({ default: false }) isEmailVerified: boolean;
  @Column({ nullable: true }) otp?: string;
  @Column({ nullable: true }) otpExpiry?: Date;
  @Column({ default: false }) twoFactorEnabled: boolean;
  @Column({ nullable: true }) resetPasswordToken?: string;
  @Column({ nullable: true }) resetPasswordExpires?: Date;
  @Column({ default: true }) isPushNotificationsEnabled: boolean;
  @Column({ default: true }) isEmailNotificationsEnabled: boolean;
  @Column({ default: false }) isUserDeleted: boolean;
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;
  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;
}
