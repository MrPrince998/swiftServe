import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { BillingSubscription } from '@modules/billing-subscription/entities/billing-subscription.entity';
import { RestaurantBranch } from '@modules/restaurant-branch/entities/resturant-branch.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, BillingSubscription, RestaurantBranch]),
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
