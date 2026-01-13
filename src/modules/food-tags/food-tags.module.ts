import { Module } from '@nestjs/common';
import { FoodTagsService } from './food-tags.service';
import { FoodTagsController } from './food-tags.controller';

@Module({
  controllers: [FoodTagsController],
  providers: [FoodTagsService],
})
export class FoodTagsModule {}
