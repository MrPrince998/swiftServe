import { restaurantStatus } from '@interfaces/restaurant.interface';
import { RestaurantBranch } from '@modules/restaurant-branch/entities/resturant-branch.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity('restaurant')
export class RestaurantTenent {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  restaurantName: string;

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
