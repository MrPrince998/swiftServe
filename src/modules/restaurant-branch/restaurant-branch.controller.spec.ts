import { Test, TestingModule } from '@nestjs/testing';
import { RestaurantBranchController } from './restaurant-branch.controller';
import { RestaurantBranchService } from './restaurant-branch.service';

describe('RestaurantBranchController', () => {
  let controller: RestaurantBranchController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RestaurantBranchController],
      providers: [RestaurantBranchService],
    }).compile();

    controller = module.get<RestaurantBranchController>(RestaurantBranchController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
