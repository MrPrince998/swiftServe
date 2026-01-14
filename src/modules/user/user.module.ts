import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { BillingSubscription } from '@modules/billing-subscription/entities/billing-subscription.entity';
import { RestaurantBranch } from '@modules/restaurant-branch/entities/resturant-branch.entity';
import { JwtGuard } from 'src/strategy/auth/jwt.guard';
import { APP_GUARD } from '@nestjs/core';
import { RolesGuard } from 'src/strategy/role/role.guard';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, BillingSubscription, RestaurantBranch]),
  ],
  controllers: [UserController],
  providers: [
    UserService,
    {
      provide: APP_GUARD,
      useClass: JwtGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
  exports: [UserService],
})
export class UserModule {}
