import { restaurantStatus } from 'src/shared/interfaces/restaurant.interface';
import { RestaurantBranch } from 'src/modules/restaurant-branch/entities/resturant-branch.entity';
import { User } from 'src/modules/user/entities/user.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity('restaurant')
export class Restaurant {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  restaurantName: string;

  @OneToMany(() => User, (user) => user.restaurant)
  users: User[];

  @Column({ nullable: true })
  ownerId: string;

  @Column({ nullable: true })
  websiteUrl: string;

  @Column()
  restaurantEmail: string;

  @Column({ nullable: true })
  restaurantPhone: string;

  @Column()
  restaurantAddress: string;

  @Column({ nullable: true })
  restaurantLogoURL: string;

  @Column({
    type: 'enum',
    enum: restaurantStatus,
    default: restaurantStatus.TRIAL,
  })
  restaurantStatus: restaurantStatus;

  @OneToMany(() => RestaurantBranch, (branch) => branch.restaurant)
  branches: RestaurantBranch[];

  @Column({ nullable: true })
  planIds?: string;

  @Column({
    type: 'timestamp',
    nullable: true,
    default: () => 'CURRENT_TIMESTAMP',
  })
  planStartDate?: Date;

  @Column({
    type: 'timestamp',
    nullable: true,
    default: () => `CURRENT_TIMESTAMP + INTERVAL '14 days'`, // Default to 14 days trial
  })
  planEndDate?: Date;

  @Column({ nullable: true })
  subscriptionStatus?: 'active' | 'expired' | 'pending';

  @Column({ nullable: true })
  subscriptionId?: string;

  @Column({ nullable: true })
  maxUsers?: number;

  @Column({ nullable: true })
  VATNumber: string;

  @Column({ nullable: true })
  registrationNumber: string;

  @Column({ type: 'jsonb', nullable: true })
  settings?: Record<string, any>;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;

  isActive(): boolean {
    if (this.restaurantStatus !== restaurantStatus.ACTIVE) return false;
    if (this.planEndDate && new Date().getTime() > this.planEndDate.getTime())
      return false;
    return true;
  }

  isTrial(): boolean {
    if (this.restaurantStatus !== restaurantStatus.TRIAL) return false;
    if (this.planEndDate && new Date().getTime() > this.planEndDate.getTime())
      return false;
    return true;
  }
}
