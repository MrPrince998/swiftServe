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
  RestaurantApiResponseDto,
  RestaurantDeleteApiResponseDto,
} from './dto/restaurant-response.dto';
import { Request } from 'express';
import { RolesGuard } from 'src/strategy/role/role.guard';
import { Roles } from 'src/strategy/role/role.decorators';
import { userRole } from 'src/shared/interfaces/user.interface';
import { APIResponse } from 'src/shared/interfaces/apiResponse';

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
    type: RestaurantApiResponseDto,
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
  ): Promise<APIResponse<RestaurantResponseDto>> {
    const userId = req.user.sub;
    const restaurant = await this.restaurantService.createRestaurant(
      createRestaurantDto,
      userId,
    );
    return {
      message: 'Restaurant created successfully',
      data: restaurant,
    };
  }

  @Get()
  @UseGuards(JwtGuard, RolesGuard)
  @Roles(userRole.SUPER_ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all restaurants' })
  @ApiResponse({
    status: 200,
    description: 'List of restaurants retrieved successfully',
    type: [RestaurantApiResponseDto],
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Invalid or missing JWT token',
  })
  async getAllRestaurants(): Promise<APIResponse<RestaurantResponseDto[]>> {
    const restaurants = await this.restaurantService.getAllRestaurants();
    return {
      message: 'List of restaurants retrieved successfully',
      data: restaurants,
    };
  }

  @Get(':id')
  @UseGuards(JwtGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get a restaurant by ID' })
  @ApiResponse({
    status: 200,
    description: 'Restaurant retrieved successfully',
    type: RestaurantApiResponseDto,
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
  async getRestaurantById(
    @Req() req: AuthenticatedRequest,
  ): Promise<APIResponse<RestaurantResponseDto>> {
    const userId = req.user.sub;
    const restaurant = await this.restaurantService.getRestaurant(userId);
    return {
      message: 'Restaurant retrieved successfully',
      data: restaurant,
    };
  }

  @Delete(':id')
  @UseGuards(JwtGuard, RolesGuard)
  @Roles(userRole.SUPER_ADMIN, userRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a restaurant' })
  @ApiResponse({
    status: 200,
    description: 'Restaurant deleted successfully',
    type: RestaurantDeleteApiResponseDto,
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
  ): Promise<APIResponse<RestaurantDeleteResponseDto>> {
    await this.restaurantService.deleteRestaurant(restaurantId);
    return {
      message: 'Restaurant deleted successfully',
      data: { message: 'Restaurant deleted successfully' },
    };
  }
}
