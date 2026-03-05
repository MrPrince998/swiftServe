import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { UserResponseDto } from './dto/userResponse.dto';
import { plainToInstance } from 'class-transformer';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  async createStaff(
    createUserDto: CreateUserDto,
    ownerId: string,
  ): Promise<UserResponseDto> {
    const { email, password, role, fullName, phoneNumber } = createUserDto;

    if (!ownerId || !email || !password || !role || !fullName) {
      throw new BadRequestException(
        'Owner ID, email, password, role, and full name are required',
      );
    }

    try {
      // Verify owner exists
      const existingOwner = await this.userRepo.findOne({
        where: { id: ownerId },
      });
      if (!existingOwner) {
        this.logger.warn(`Owner not found: ${ownerId}`);
        throw new NotFoundException('Owner not found');
      }

      // Check for existing email
      const existingEmail = await this.userRepo.findOne({
        where: { email, isUserDeleted: false },
      });
      if (existingEmail) {
        this.logger.warn(
          `Attempt to create user with existing email: ${email}`,
        );
        throw new ConflictException('Email already in use');
      }

      // Check for existing phone number if provided
      if (phoneNumber) {
        const existingPhone = await this.userRepo.findOne({
          where: { phoneNumber, isUserDeleted: false },
        });
        if (existingPhone) {
          this.logger.warn(
            `Attempt to create user with existing phone: ${phoneNumber}`,
          );
          throw new ConflictException('Phone number already in use');
        }
      }

      const hashedPassword = await bcrypt.hash(password, 12);

      const newUser = this.userRepo.create({
        email,
        password: hashedPassword,
        role,
        fullName,
        phoneNumber,
        // restaurant relationship will be handled separately if needed
      });

      const savedUser = await this.userRepo.save(newUser);

      this.logger.log(
        `User created successfully: ${savedUser.id} by owner: ${ownerId}`,
      );

      return plainToInstance(UserResponseDto, savedUser, {
        excludeExtraneousValues: true,
      });
    } catch (error) {
      if (
        error instanceof BadRequestException ||
        error instanceof NotFoundException ||
        error instanceof ConflictException
      ) {
        throw error;
      }

      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      const errorStack = error instanceof Error ? error.stack : undefined;
      this.logger.error(`Failed to create user: ${errorMessage}`, errorStack);
      throw new BadRequestException('Failed to create user');
    }
  }

  async findAll(): Promise<UserResponseDto[]> {
    try {
      const users = await this.userRepo.find({
        where: { isUserDeleted: false },
      });

      return plainToInstance(UserResponseDto, users, {
        excludeExtraneousValues: true,
      });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      const errorStack = error instanceof Error ? error.stack : undefined;
      this.logger.error(
        `Failed to retrieve users: ${errorMessage}`,
        errorStack,
      );
      throw new BadRequestException('Failed to retrieve users');
    }
  }

  async findOne(id: string): Promise<UserResponseDto> {
    if (!id) {
      throw new BadRequestException('User ID is required');
    }

    try {
      const user = await this.userRepo.findOne({
        where: { id, isUserDeleted: false },
      });

      if (!user) {
        throw new NotFoundException('User not found');
      }

      return plainToInstance(UserResponseDto, user, {
        excludeExtraneousValues: true,
      });
    } catch (error) {
      if (
        error instanceof BadRequestException ||
        error instanceof NotFoundException
      ) {
        throw error;
      }

      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      const errorStack = error instanceof Error ? error.stack : undefined;
      this.logger.error(
        `Failed to find user ${id}: ${errorMessage}`,
        errorStack,
      );
      throw new BadRequestException('Failed to retrieve user');
    }
  }

  async update(
    id: string,
    updateUserDto: UpdateUserDto,
  ): Promise<UserResponseDto> {
    if (!id) {
      throw new BadRequestException('User ID is required');
    }

    try {
      const user = await this.userRepo.findOne({
        where: { id, isUserDeleted: false },
      });

      if (!user) {
        throw new NotFoundException('User not found');
      }

      // Check email uniqueness if email is being updated
      if (updateUserDto.email && updateUserDto.email !== user.email) {
        const existingEmailUser = await this.userRepo.findOne({
          where: {
            email: updateUserDto.email,
            isUserDeleted: false,
          },
        });
        if (existingEmailUser) {
          this.logger.warn(
            `Attempt to update to existing email: ${updateUserDto.email}`,
          );
          throw new ConflictException('Email already in use');
        }
      }

      // Check phone number uniqueness if phone is being updated
      if (
        updateUserDto.phoneNumber &&
        updateUserDto.phoneNumber !== user.phoneNumber
      ) {
        const existingPhoneUser = await this.userRepo.findOne({
          where: {
            phoneNumber: updateUserDto.phoneNumber,
            isUserDeleted: false,
          },
        });

        if (existingPhoneUser) {
          this.logger.warn(
            `Attempt to update to existing phone: ${updateUserDto.phoneNumber}`,
          );
          throw new ConflictException('Phone number already in use');
        }
      }

      // Define allowed fields for update
      const allowedFields: (keyof UpdateUserDto)[] = [
        'fullName',
        'email',
        'phoneNumber',
        'role',
        'imageUrl',
        'employeeID',
        'isEmployed',
        'isSubscribed',
        'twoFactorEnabled',
        'isPushNotificationsEnabled',
        'isEmailNotificationsEnabled',
      ];

      const filteredUpdate: Partial<User> = {};

      for (const field of allowedFields) {
        if (field in updateUserDto && updateUserDto[field] !== undefined) {
          (filteredUpdate as any)[field] = updateUserDto[field];
        }
      }

      if (Object.keys(filteredUpdate).length === 0) {
        throw new BadRequestException('No valid fields provided for update');
      }

      const updateUser = await this.userRepo.preload({ id, ...filteredUpdate });

      if (!updateUser) {
        throw new NotFoundException('User not found during update');
      }

      const savedUser = await this.userRepo.save(updateUser);

      this.logger.log(`User updated successfully: ${savedUser.id}`);

      return plainToInstance(UserResponseDto, savedUser, {
        excludeExtraneousValues: true,
      });
    } catch (error) {
      if (
        error instanceof BadRequestException ||
        error instanceof NotFoundException ||
        error instanceof ConflictException
      ) {
        throw error;
      }

      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      const errorStack = error instanceof Error ? error.stack : undefined;
      this.logger.error(
        `Failed to update user ${id}: ${errorMessage}`,
        errorStack,
      );
      throw new BadRequestException('Failed to update user');
    }
  }

  async softDelete(id: string): Promise<{ message: string }> {
    if (!id) {
      throw new BadRequestException('User ID is required');
    }

    try {
      const user = await this.userRepo.findOne({ where: { id } });
      if (!user) {
        throw new NotFoundException('User not found');
      }

      if (user.isUserDeleted) {
        throw new BadRequestException('User is already deleted');
      }

      // Soft delete by setting isUserDeleted flag
      await this.userRepo.update(id, { isUserDeleted: true });

      this.logger.log(`User soft deleted successfully: ${id}`);

      return { message: 'User deleted successfully' };
    } catch (error) {
      if (
        error instanceof BadRequestException ||
        error instanceof NotFoundException
      ) {
        throw error;
      }

      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      const errorStack = error instanceof Error ? error.stack : undefined;
      this.logger.error(
        `Failed to delete user ${id}: ${errorMessage}`,
        errorStack,
      );
      throw new BadRequestException('Failed to delete user');
    }
  }

  async getProfile(id: string): Promise<UserResponseDto> {
    if (!id) {
      throw new BadRequestException('User ID is required');
    }

    try {
      const user = await this.userRepo.findOne({
        where: { id, isUserDeleted: false },
      });

      if (!user) {
        throw new NotFoundException('User not found');
      }

      return plainToInstance(UserResponseDto, user, {
        excludeExtraneousValues: true,
      });
    } catch (error) {
      if (
        error instanceof BadRequestException ||
        error instanceof NotFoundException
      ) {
        throw error;
      }

      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      const errorStack = error instanceof Error ? error.stack : undefined;
      this.logger.error(
        `Failed to get profile for user ${id}: ${errorMessage}`,
        errorStack,
      );
      throw new BadRequestException('Failed to retrieve user profile');
    }
  }

  async changePassword(
    userId: string,
    changePasswordDto: ChangePasswordDto,
  ): Promise<void> {
    const { currentPassword, newPassword, confirmPassword } = changePasswordDto;

    if (newPassword !== confirmPassword) {
      throw new BadRequestException(
        'New password and confirm password do not match',
      );
    }

    try {
      const user = await this.userRepo.findOne({
        where: { id: userId, isUserDeleted: false },
        select: ['id', 'password'], // Include password for verification
      });

      if (!user) {
        throw new NotFoundException('User not found');
      }

      // Verify current password
      const isCurrentPasswordValid = await bcrypt.compare(
        currentPassword,
        user.password,
      );
      if (!isCurrentPasswordValid) {
        this.logger.warn(
          `Invalid current password attempt for user: ${userId}`,
        );
        throw new BadRequestException('Current password is incorrect');
      }

      // Hash new password
      const hashedNewPassword = await bcrypt.hash(newPassword, 12);

      // Update password
      await this.userRepo.update(userId, { password: hashedNewPassword });

      this.logger.log(`Password changed successfully for user: ${userId}`);
    } catch (error) {
      if (
        error instanceof BadRequestException ||
        error instanceof NotFoundException
      ) {
        throw error;
      }

      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      const errorStack = error instanceof Error ? error.stack : undefined;
      this.logger.error(
        `Failed to change password for user ${userId}: ${errorMessage}`,
        errorStack,
      );
      throw new BadRequestException('Failed to change password');
    }
  }
}
