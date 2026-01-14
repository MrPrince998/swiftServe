import { Controller } from '@nestjs/common';
import { RestaurantBranchService } from './restaurant-branch.service';

@Controller('branch')
export class RestaurantBranchController {
  constructor(
    private readonly restaurantBranchService: RestaurantBranchService,
  ) {}

  // @Post()
  // create
}
