import { Test, TestingModule } from '@nestjs/testing';
import { TenentService } from './tenent.service';

describe('TenentService', () => {
  let service: TenentService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TenentService],
    }).compile();

    service = module.get<TenentService>(TenentService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
