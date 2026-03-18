import { Module } from '@nestjs/common';
import { RestaurantService } from './restaurant.service';
import { RestaurantController } from './restaurant.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RestaurantBranch } from 'src/modules/restaurant-branch/entities/resturant-branch.entity';
import { FoodTags } from 'src/modules/food-tags/entities/foodTags.entity';
import { MenuItem } from 'src/modules/menu-item/entities/menuItem.enitity';
import { Table } from 'src/modules/table/entities/table.entity';
import { Restaurant } from './entities/restaurant.entity';
import { User } from '@modules/user/entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      RestaurantBranch,
      FoodTags,
      MenuItem,
      Table,
      Restaurant,
      User,
    ]),
  ],
  controllers: [RestaurantController],
  providers: [RestaurantService],
})
export class RestaurantModule {}
