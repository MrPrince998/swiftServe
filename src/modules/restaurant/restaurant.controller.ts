import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { RestaurantService } from './restaurant.service';
import { JwtGuard } from 'src/strategy/auth/jwt.guard';
import { ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { CreateRestaurantDto } from './dto/create-restaurant.dto';
import {
  RestaurantDeleteResponseDto,
  RestaurantResponseDto,
} from './dto/restaurant-response.dto';
import { Request } from 'express';
import { RolesGuard } from 'src/strategy/role/role.guard';
import { Roles } from 'src/strategy/role/role.decorators';
import { userRole } from 'src/shared/interfaces/user.interface';

interface JwtUser {
  sub: string;
  email: string;
  iat?: number;
  exp?: number;
}

interface AuthenticatedRequest extends Request {
  user: JwtUser;
}

@Controller('restaurant')
export class RestaurantController {
  constructor(private readonly restaurantService: RestaurantService) {}

  @Post()
  @UseGuards(JwtGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new restaurant' })
  @ApiResponse({
    status: 201,
    description: 'Restaurant created successfully',
    type: RestaurantResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid input data or restaurant already exists',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Invalid or missing JWT token',
  })
  async createRestaurant(
    @Body() createRestaurantDto: CreateRestaurantDto,
    @Req() req: AuthenticatedRequest,
  ): Promise<RestaurantResponseDto> {
    const userId = req.user.sub;
    return this.restaurantService.createRestaurant(createRestaurantDto, userId);
  }

  @Delete(':id')
  @UseGuards(JwtGuard, RolesGuard)
  @Roles(userRole.ADMIN, userRole.USER)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a restaurant' })
  @ApiResponse({
    status: 200,
    description: 'Restaurant deleted successfully',
    type: RestaurantDeleteResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid restaurant ID or restaurant not found',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Invalid or missing JWT token',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Insufficient permissions (ADMIN role)',
  })
  async deleteRestaurant(
    @Req() req: AuthenticatedRequest,
    @Param('id') restaurantId: string,
  ): Promise<RestaurantDeleteResponseDto> {
    await this.restaurantService.deleteRestaurant(restaurantId);
    return { message: 'Restaurant deleted successfully' };
  }
}
