import { Controller } from '@nestjs/common';
import { TenentService } from './tenent.service';

@Controller('tenent')
export class TenentController {
  constructor(private readonly tenentService: TenentService) {}
}
