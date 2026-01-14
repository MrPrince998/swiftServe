import { Module } from '@nestjs/common';
import { MenuItemService } from './menu-item.service';
import { MenuItemController } from './menu-item.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FoodTags } from '@modules/food-tags/entities/foodTags.entity';
import { RestaurantBranch } from '@modules/restaurant-branch/entities/resturant-branch.entity';

@Module({
  imports: [TypeOrmModule.forFeature([FoodTags, RestaurantBranch])],
  controllers: [MenuItemController],
  providers: [MenuItemService],
})
export class MenuItemModule {}
