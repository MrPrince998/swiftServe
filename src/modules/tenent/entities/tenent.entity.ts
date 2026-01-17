import { restaurantStatus } from '@interfaces/restaurant.interface';
import { RestaurantBranch } from '@modules/restaurant-branch/entities/resturant-branch.entity';
import { User } from '@modules/user/entities/user.entity';
import { Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity('restaurant')
export class RestaurantTenent {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  restaurantName: string;

  @OneToOne(() => User, (user) => user.restaurant, {
    cascade: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'ownerId' })
  owner: User;
  
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
    default: restaurantStatus.ACTIVE,
  })
  restaurantStatus: restaurantStatus;

  @OneToMany(() => RestaurantBranch, (branch) => branch.restaurant)
  branches: RestaurantBranch[];

  @Column({ nullable: true })
  planIds?: string;

  @Column({ nullable: true })
  subscriptionStatus?: string;

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
}
