import { Test, TestingModule } from '@nestjs/testing';
import { BillingSubscriptionService } from './billing-subscription.service';

describe('BillingSubscriptionService', () => {
  let service: BillingSubscriptionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BillingSubscriptionService],
    }).compile();

    service = module.get<BillingSubscriptionService>(BillingSubscriptionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
