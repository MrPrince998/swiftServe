import { Injectable } from '@nestjs/common';
import { CreateBillingSubscriptionDto } from './dto/create-billing-subscription.dto';
import { UpdateBillingSubscriptionDto } from './dto/update-billing-subscription.dto';

@Injectable()
export class BillingSubscriptionService {
  create(createBillingSubscriptionDto: CreateBillingSubscriptionDto) {
    return 'This action adds a new billingSubscription';
  }

  findAll() {
    return `This action returns all billingSubscription`;
  }

  findOne(id: number) {
    return `This action returns a #${id} billingSubscription`;
  }

  update(id: number, updateBillingSubscriptionDto: UpdateBillingSubscriptionDto) {
    return `This action updates a #${id} billingSubscription`;
  }

  remove(id: number) {
    return `This action removes a #${id} billingSubscription`;
  }
}
