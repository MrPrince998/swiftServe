import { RestaurantTenent } from '@modules/tenent/entities/tenent.entity';
import { User } from '@modules/user/entities/user.entity';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('restaurant_branches')
export class RestaurantBranch {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => RestaurantTenent, (restaurant) => restaurant.branches)
  restaurant: RestaurantTenent;

  @Column()
  branchCode: string;

  @Column()
  totalStaff: number;

  @OneToMany(() => User, (user) => user.restaurantBranch)
  staff: User[];
}
