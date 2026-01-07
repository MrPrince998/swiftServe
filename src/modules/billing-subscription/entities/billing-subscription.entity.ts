import { User } from '@modules/user/entities/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('billing_subscriptions')
export class BillingSubscription {
  @PrimaryGeneratedColumn('uuid') id: string;
  @Column({ nullable: true }) subscriptionPlanDetails: string;
  @Column({ nullable: true }) subscriptionStartDate: Date;
  @Column({ nullable: true }) subscriptionEndDate: Date;
  @Column({ default: false }) isActive: boolean;
  @Column({ default: false }) isOnTrial: boolean;
  @Column({ nullable: true }) purachseHistory: string[];
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;
  @OneToOne(() => User, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  user: User;
  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;
}
