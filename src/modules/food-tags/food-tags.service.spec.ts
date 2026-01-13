import { Test, TestingModule } from '@nestjs/testing';
import { FoodTagsService } from './food-tags.service';

describe('FoodTagsService', () => {
  let service: FoodTagsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FoodTagsService],
    }).compile();

    service = module.get<FoodTagsService>(FoodTagsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
