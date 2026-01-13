import { Module } from '@nestjs/common';
import { RestaurantBranchService } from './restaurant-branch.service';
import { RestaurantBranchController } from './restaurant-branch.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '@modules/user/entities/user.entity';
import { RestaurantTenent } from '@modules/tenent/entities/tenent.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, RestaurantTenent])],
  controllers: [RestaurantBranchController],
  providers: [RestaurantBranchService],
})
export class RestaurantBranchModule {}
