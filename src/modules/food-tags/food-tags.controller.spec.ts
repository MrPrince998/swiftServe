import { Test, TestingModule } from '@nestjs/testing';
import { FoodTagsController } from './food-tags.controller';
import { FoodTagsService } from './food-tags.service';

describe('FoodTagsController', () => {
  let controller: FoodTagsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FoodTagsController],
      providers: [FoodTagsService],
    }).compile();

    controller = module.get<FoodTagsController>(FoodTagsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
