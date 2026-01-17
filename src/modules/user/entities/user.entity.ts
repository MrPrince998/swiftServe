import { userRole } from '@interfaces/user.interface';
import { BillingSubscription } from '@modules/billing-subscription/entities/billing-subscription.entity';
import {
  Column,
  Entity,
  OneToOne,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { RestaurantBranch } from '@modules/restaurant-branch/entities/resturant-branch.entity';
import { RestaurantTenent } from '@modules/tenent/entities/tenent.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid') id: string;
  @Column() fullName: string;
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

  @OneToOne(() => RestaurantTenent, (tenent) => tenent.owner)
  restaurant?: RestaurantTenent;
  @ManyToOne(() => RestaurantBranch, (branch) => branch.staff)
  restaurantBranch?: RestaurantBranch;
  @Column({ default: false }) isSubscribed: boolean;

  @Column({ nullable: true })
  subscriptionId?: string;

  @OneToOne(() => BillingSubscription, (subscription) => subscription.user)
  subscription?: BillingSubscription;

  @Column({ type: 'simple-array', nullable: true }) notificationIds?: string[];
  @Column({ default: false }) isEmailVerified: boolean;
  @Column({default: false}) isAgreementAccepted: boolean;
  @Column({ nullable: true }) otp?: string;
  @Column({ nullable: true }) otpExpiry?: Date;
  @Column({ default: false }) twoFactorEnabled: boolean;
  @Column({ type: 'varchar', length: 64, nullable: true }) resetPasswordToken?: string | null;
  @Column({ type: 'timestamp', nullable: true }) resetPasswordExpires?: Date | null;
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
