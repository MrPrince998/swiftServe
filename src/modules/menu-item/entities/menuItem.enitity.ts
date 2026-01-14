import { FoodTags } from '@modules/food-tags/entities/foodTags.entity';
import { RestaurantBranch } from '@modules/restaurant-branch/entities/resturant-branch.entity';
import {
  Column,
  Entity,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class MenuItem {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column('decimal', { precision: 10, scale: 2 })
  price: number;

  @Column()
  imageUrl: string;

  @Column()
  category: string;

  @OneToMany(() => FoodTags, (tag) => tag.menuItem, { cascade: true })
  tags: FoodTags[];

  @ManyToMany(() => RestaurantBranch, (branch) => branch.menuItems)
  branches: RestaurantBranch[];

  @Column({ default: 0 })
  totalOrders: number;

  @Column({ default: 0 })
  lastMonthOrders: number;

  @Column('decimal', { precision: 15, scale: 2, default: 0 })
  totalRevenue: number;

  @Column('decimal', { precision: 15, scale: 2, default: 0 })
  lastMonthRevenue: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;
}
