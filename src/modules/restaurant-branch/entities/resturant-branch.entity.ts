import { MenuItem } from 'src/modules/menu-item/entities/menuItem.enitity';
import { Table } from 'src/modules/table/entities/table.entity';
import { Restaurant } from '@modules/restaurant/entities/restaurant.entity';
import { User } from 'src/modules/user/entities/user.entity';
import {
  Column,
  Entity,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('restaurant_branches')
export class RestaurantBranch {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Restaurant, (restaurant) => restaurant.branches)
  restaurant: Restaurant;

  @Column()
  branchCode: string;

  @Column()
  totalStaff: number;

  @OneToMany(() => User, (user) => user.restaurantBranch)
  staff: User[];

  @Column()
  branchAddress: string;

  @Column()
  branchPhone: string;

  @Column()
  branchEmail: string;

  @Column()
  branchStatus: boolean;

  @Column()
  totalRevenue: number;

  @Column()
  totalOrders: number;

  @Column({ default: 0 })
  rating: number;

  @OneToMany(() => Table, (table) => table.tableStatus)
  tables: Table[];

  @ManyToMany(() => MenuItem, (item) => item.branches)
  menuItems: MenuItem[];

  @OneToMany(() => MenuItem, (item) => item.branches)
  products: MenuItem[];

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;
}
