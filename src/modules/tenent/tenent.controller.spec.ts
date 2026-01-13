import { Test, TestingModule } from '@nestjs/testing';
import { TenentController } from './tenent.controller';
import { TenentService } from './tenent.service';

describe('TenentController', () => {
  let controller: TenentController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TenentController],
      providers: [TenentService],
    }).compile();

    controller = module.get<TenentController>(TenentController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
