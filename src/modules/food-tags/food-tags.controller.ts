import { Controller } from '@nestjs/common';
import { FoodTagsService } from './food-tags.service';

@Controller('food-tags')
export class FoodTagsController {
  constructor(private readonly foodTagsService: FoodTagsService) {}
}
