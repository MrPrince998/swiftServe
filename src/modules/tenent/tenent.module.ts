import { Module } from '@nestjs/common';
import { TenentService } from './tenent.service';
import { TenentController } from './tenent.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RestaurantBranch } from '@modules/restaurant-branch/entities/resturant-branch.entity';
import { FoodTags } from '@modules/food-tags/entities/foodTags.entity';
import { MenuItem } from '@modules/menu-item/entities/menuItem.enitity';
import { Table } from '@modules/table/entities/table.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([RestaurantBranch, FoodTags, MenuItem, Table]),
  ],
  controllers: [TenentController],
  providers: [TenentService],
})
export class TenentModule {}
