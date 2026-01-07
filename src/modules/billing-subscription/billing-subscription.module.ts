import { Module } from '@nestjs/common';
import { BillingSubscriptionService } from './billing-subscription.service';
import { BillingSubscriptionController } from './billing-subscription.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '@modules/user/entities/user.entity';

@Module({
  controllers: [BillingSubscriptionController],
  providers: [BillingSubscriptionService],
  imports: [TypeOrmModule.forFeature([User])],
})
export class BillingSubscriptionModule {}
