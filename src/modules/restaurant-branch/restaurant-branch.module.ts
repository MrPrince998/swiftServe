import { Module } from '@nestjs/common';
import { RestaurantBranchService } from './restaurant-branch.service';
import { RestaurantBranchController } from './restaurant-branch.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/modules/user/entities/user.entity';
import { Restaurant } from '@modules/restaurant/entities/restaurant.entity';
import { Table } from 'src/modules/table/entities/table.entity';
import { MenuItem } from 'src/modules/menu-item/entities/menuItem.enitity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Restaurant, Table, MenuItem])],
  controllers: [RestaurantBranchController],
  providers: [RestaurantBranchService],
})
export class RestaurantBranchModule {}
