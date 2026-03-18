import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Restaurant } from './entities/restaurant.entity';
import { Repository } from 'typeorm';
import { CreateRestaurantDto } from './dto/create-restaurant.dto';
import { User } from '@modules/user/entities/user.entity';

@Injectable()
export class RestaurantService {
  private readonly logger = new Logger(RestaurantService.name);

  constructor(
    @InjectRepository(Restaurant)
    private readonly restaurantRepo: Repository<Restaurant>,
    @InjectRepository(User)
    private readonly User: Repository<User>,
  ) {}

  async createRestaurant(
    createRestaurantDto: CreateRestaurantDto,
    userId: string,
  ): Promise<Restaurant> {
    const {
      restaurantName,
      websiteUrl,
      restaurantEmail,
      restaurantPhone,
      restaurantAddress,
    } = createRestaurantDto;

    try {
      // Check for existing restaurant by email
      const existingRestaurant = await this.restaurantRepo.findOne({
        where: { restaurantEmail },
      });

      if (existingRestaurant) {
        this.logger.warn(
          `Restaurant creation failed: email ${restaurantEmail} already exists`,
        );
        throw new BadRequestException(
          'Restaurant with this email already exists',
        );
      }

      // Check for existing restaurant by phone (if provided)
      if (restaurantPhone) {
        const existingPhoneRestaurant = await this.restaurantRepo.findOne({
          where: { restaurantPhone },
        });

        if (existingPhoneRestaurant) {
          this.logger.warn(
            `Restaurant creation failed: phone ${restaurantPhone} already exists`,
          );
          throw new BadRequestException(
            'Restaurant with this phone number already exists',
          );
        }
      }

      const restaurant = this.restaurantRepo.create({
        restaurantName,
        websiteUrl,
        restaurantEmail,
        restaurantPhone,
        restaurantAddress,
        ownerId: userId,
      });

      const savedRestaurant = await this.restaurantRepo.save(restaurant);

      this.logger.log(
        `Restaurant created successfully: ${savedRestaurant.id} by user: ${userId}`,
      );

      return savedRestaurant;
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }

      const err = error instanceof Error ? error : new Error(String(error));
      this.logger.error(
        `Failed to create restaurant: ${err.message}`,
        err.stack,
      );
      throw new BadRequestException('Failed to create restaurant');
    }
  }

  async getAllRestaurants(): Promise<Restaurant[]> {
    try {
      const restaurants = await this.restaurantRepo.find();
      this.logger.log(`Retrieved ${restaurants.length} restaurants`);
      return restaurants;
    } catch (error) {
      const err = error instanceof Error ? error : new Error(String(error));
      this.logger.error(
        `Failed to retrieve restaurants: ${err.message}`,
        err.stack,
      );
      throw new BadRequestException('Failed to retrieve restaurants');
    }
  }

  async getRestaurant(userId: string): Promise<Restaurant> {
    try {
      const userData = await this.User.findOne({
        where: { id: userId },
      });

      if (!userData) {
        this.logger.warn(
          `Restaurant retrieval failed: user with id ${userId} not found`,
        );
        throw new BadRequestException('User not found');
      }

      if (userData.restaurant?.id) {
        this.logger.warn(
          `Restaurant retrieval failed: user ${userId} does not have access to restaurant ${userData.restaurant.id}`,
        );
        throw new BadRequestException(
          'User does not have access to this restaurant',
        );
      }

      const restaurant = await this.restaurantRepo.findOne({
        where: { id: userData.restaurant?.id },
      });
      if (!restaurant) {
        this.logger.warn(
          `Restaurant retrieval failed: restaurant with id ${userData.restaurant?.id} not found`,
        );
        throw new BadRequestException('Restaurant not found');
      }
      this.logger.log(
        `Restaurant retrieved successfully: ${userData.restaurant?.id}`,
      );
      return restaurant;
    } catch (error) {
      const err = error instanceof Error ? error : new Error(String(error));
      this.logger.error(
        `Failed to retrieve restaurant: ${err.message}`,
        err.stack,
      );
      throw new BadRequestException('Failed to retrieve restaurant');
    }
  }

  // async getCurrentWorkingRestaurant(): Promise<Restaurant> {
  //   try {
  //     const restaurant = await this.restaurantRepo.findOne({

  async deleteRestaurant(restaurantId: string): Promise<void> {
    try {
      const restaurant = await this.restaurantRepo.findOne({
        where: { id: restaurantId },
      });
      if (!restaurant) {
        this.logger.warn(
          `Restaurant deletion failed: restaurant with id ${restaurantId} not found`,
        );
        throw new BadRequestException('Restaurant not found');
      }
      await this.restaurantRepo.remove(restaurant);
      this.logger.log(`Restaurant deleted successfully: ${restaurantId}`);
    } catch (error) {
      const err = error instanceof Error ? error : new Error(String(error));
      this.logger.error(
        `Failed to delete restaurant: ${err.message}`,
        err.stack,
      );
      throw new BadRequestException('Failed to delete restaurant');
    }
  }
}
