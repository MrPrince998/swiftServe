import { Test, TestingModule } from '@nestjs/testing';
import { RestaurantBranchService } from './restaurant-branch.service';

describe('RestaurantBranchService', () => {
  let service: RestaurantBranchService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RestaurantBranchService],
    }).compile();

    service = module.get<RestaurantBranchService>(RestaurantBranchService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
