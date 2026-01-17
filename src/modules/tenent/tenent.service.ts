import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RestaurantTenent } from './entities/tenent.entity';
import { Repository } from 'typeorm';

@Injectable()
export class TenentService {
    constructor (
        @InjectRepository(RestaurantTenent)
        private readonly tenentRepo: Repository<RestaurantTenent>,
    ) {}

    async createRestaurant(tenent: RestaurantTenent, userId: string) {
        const existingRestaurant = await this.tenentRepo.findOne({
            where: {owner: {id: userId}},
        });
        if (existingRestaurant) {
            throw new BadRequestException('You already have a restaurant');
        }
        
        const restaurant = this.tenentRepo.create({
            ...tenent,
            owner: {id: userId},
        });
        return await this.tenentRepo.save(restaurant);
    }

    async getMyRestaurant(userId: string) {
        const restaurant = await this.tenentRepo.findOne({
            where: {owner: {id: userId}},
        });
        if (!restaurant) {
            throw new BadRequestException('Restaurant not found');
        }
        return restaurant;
    }

    async updateRestaurant(tenent: RestaurantTenent, userId: string) {
        const existingRestaurant = await this.tenentRepo.findOne({
            where: {owner: {id: userId}},
        });
        if (!existingRestaurant) {
            throw new BadRequestException('Restaurant not found');
        }
        
        const restaurant = this.tenentRepo.merge(existingRestaurant, tenent);
        return await this.tenentRepo.save(restaurant);
    }

    async deleteRestaurant(userId: string) {
        const existingRestaurant = await this.tenentRepo.findOne({
            where: {owner: {id: userId}},
        });
        if (!existingRestaurant) {
            throw new BadRequestException('Restaurant not found');
        }
        
        await this.tenentRepo.remove(existingRestaurant);
        return { message: 'Restaurant deleted successfully' };
    }
}
