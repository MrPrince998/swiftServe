import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Restaurant } from './entities/restaurant.entity';
import { Repository } from 'typeorm';
import { CreateRestaurantDto } from './dto/create-restaurant.dto';

@Injectable()
export class RestaurantService {
  private readonly logger = new Logger(RestaurantService.name);

  constructor(
    @InjectRepository(Restaurant)
    private readonly restaurantRepo: Repository<Restaurant>,
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
