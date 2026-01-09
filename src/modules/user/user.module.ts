import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { BillingSubscription } from '@modules/billing-subscription/entities/billing-subscription.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, BillingSubscription])],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
