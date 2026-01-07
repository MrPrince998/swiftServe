import { Test, TestingModule } from '@nestjs/testing';
import { BillingSubscriptionController } from './billing-subscription.controller';
import { BillingSubscriptionService } from './billing-subscription.service';

describe('BillingSubscriptionController', () => {
  let controller: BillingSubscriptionController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BillingSubscriptionController],
      providers: [BillingSubscriptionService],
    }).compile();

    controller = module.get<BillingSubscriptionController>(BillingSubscriptionController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
