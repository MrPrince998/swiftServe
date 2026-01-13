import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { UserResponseDto } from './dto/userResponse.dto';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  async findAll(): Promise<UserResponseDto[]> {
    const users = await this.userRepo.find();
    return plainToInstance(UserResponseDto, users, {
      excludeExtraneousValues: true,
    });
  }

  async findOne(id: string): Promise<UserResponseDto> {
    if (!id) {
      throw new Error('id is missing');
    }
    const user = await this.userRepo.findOne({ where: { id } });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // const { password, ...rest } = user;
    return plainToInstance(UserResponseDto, user, {
      excludeExtraneousValues: true,
    });
  }

  async update(
    id: string,
    updateUserDto: UpdateUserDto,
  ): Promise<UserResponseDto> {
    if (!id) {
      throw new Error('id is missing');
    }

    if ('password' in updateUserDto || 'isUserDeleted' in updateUserDto) {
      delete updateUserDto.password;
      delete updateUserDto.isUserDeleted;
    }

    const user = await this.userRepo.findOne({ where: { id } });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (updateUserDto.email) {
      const existingEmailUser = await this.userRepo.findOne({
        where: { email: updateUserDto.email },
      });
      if (existingEmailUser && existingEmailUser.id !== id) {
        throw new Error('Email already in use');
      }

      const existingPhoneUser = await this.userRepo.findOne({
        where: { phoneNumber: updateUserDto.phoneNumber },
      });

      if (existingPhoneUser && existingPhoneUser.id !== id) {
        throw new Error('Phone number already in use');
      }
    }

    const allowedFields: (keyof User)[] = [
      'username',
      'role',
      'imageUrl',
      'employeeID',
      'restaurantBranch',
      'isEmployed',
      'isSubscribed',
      'subscriptionId',
    ];

    const filteredUpdate: Partial<User> = {};

    for (const field of allowedFields) {
      if (field in updateUserDto) {
        if (updateUserDto[field] !== undefined) {
          (filteredUpdate as any)[field] = updateUserDto[field];
        }
      }
    }

    const updateUser = await this.userRepo.preload({ id, ...filteredUpdate });

    if (!updateUser) {
      throw new NotFoundException('User not found during preload');
    }
    const savedUser = await this.userRepo.save(updateUser);

    return plainToInstance(UserResponseDto, savedUser, {
      excludeExtraneousValues: true,
    });
  }

  // async softDelete(id: string): Promise<User> {
  //   return this.userRepo.softDelete(id);
  // }

  // async remove(id: string): Promise<User> {
  //   return this.userRepo.remove(id);
  // }
}
