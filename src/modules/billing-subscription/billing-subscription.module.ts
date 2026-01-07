import { Module } from '@nestjs/common';
import { BillingSubscriptionService } from './billing-subscription.service';
import { BillingSubscriptionController } from './billing-subscription.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BillingSubscription } from './entities/billing-subscription.entity';

@Module({
  imports: [TypeOrmModule.forFeature([BillingSubscription])],
  controllers: [BillingSubscriptionController],
  providers: [BillingSubscriptionService],
})
export class BillingSubscriptionModule { }
