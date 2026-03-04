import { Module } from '@nestjs/common';
import { TenentService } from './tenent.service';
import { TenentController } from './tenent.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RestaurantBranch } from 'src/modules/restaurant-branch/entities/resturant-branch.entity';
import { FoodTags } from 'src/modules/food-tags/entities/foodTags.entity';
import { MenuItem } from 'src/modules/menu-item/entities/menuItem.enitity';
import { Table } from 'src/modules/table/entities/table.entity';
import { RestaurantTenent } from './entities/tenent.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      RestaurantBranch,
      FoodTags,
      MenuItem,
      Table,
      RestaurantTenent,
    ]),
  ],
  controllers: [TenentController],
  providers: [TenentService],
})
export class TenentModule {}
