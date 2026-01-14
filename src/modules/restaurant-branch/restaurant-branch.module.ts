import { Module } from '@nestjs/common';
import { RestaurantBranchService } from './restaurant-branch.service';
import { RestaurantBranchController } from './restaurant-branch.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '@modules/user/entities/user.entity';
import { RestaurantTenent } from '@modules/tenent/entities/tenent.entity';
import { Table } from '@modules/table/entities/table.entity';
import { MenuItem } from '@modules/menu-item/entities/menuItem.enitity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, RestaurantTenent, Table, MenuItem]),
  ],
  controllers: [RestaurantBranchController],
  providers: [RestaurantBranchService],
})
export class RestaurantBranchModule {}
