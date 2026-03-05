import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  IsBoolean,
  IsUUID,
  IsUrl,
  IsPhoneNumber,
} from 'class-validator';
import { userRole } from 'src/shared/interfaces/user.interface';

export class UpdateUserDto {
  @ApiProperty({
    example: 'John Doe',
    description: 'Full name of the user',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'Full name must be a string' })
  @Transform(({ value }) => value?.trim())
  fullName?: string;

  @ApiProperty({
    example: 'john.doe@example.com',
    description: 'Email address',
    required: false,
  })
  @IsOptional()
  @IsEmail({}, { message: 'Email must be a valid email address' })
  @Transform(({ value }) => value?.trim().toLowerCase())
  email?: string;

  @ApiProperty({
    example: '+1234567890',
    description: 'Phone number',
    required: false,
  })
  @IsOptional()
  @IsPhoneNumber(undefined, { message: 'Phone number must be valid' })
  @Transform(({ value }) => value?.trim())
  phoneNumber?: string;

  @ApiProperty({
    enum: userRole,
    example: userRole.USER,
    description: 'User role',
    required: false,
  })
  @IsOptional()
  @IsEnum(userRole, { message: 'Role must be a valid user role' })
  role?: userRole;

  @ApiProperty({
    example: 'https://example.com/avatar.jpg',
    description: 'Profile image URL',
    required: false,
  })
  @IsOptional()
  @IsUrl({}, { message: 'Image URL must be a valid URL' })
  imageUrl?: string;

  @ApiProperty({
    example: true,
    description: 'Whether user is employed',
    required: false,
  })
  @IsOptional()
  @IsBoolean({ message: 'isEmployed must be a boolean' })
  isEmployed?: boolean;

  @ApiProperty({
    example: 'EMP001',
    description: 'Employee ID',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'Employee ID must be a string' })
  employeeID?: string;

  @ApiProperty({
    example: '550e8400-e29b-41d4-a716-446655440000',
    description: 'Restaurant ID',
    required: false,
  })
  @IsOptional()
  @IsUUID(4, { message: 'Restaurant ID must be a valid UUID' })
  restaurantId?: string;

  @ApiProperty({
    example: true,
    description: 'Whether user is subscribed',
    required: false,
  })
  @IsOptional()
  @IsBoolean({ message: 'isSubscribed must be a boolean' })
  isSubscribed?: boolean;

  @ApiProperty({
    example: true,
    description: 'Whether two-factor authentication is enabled',
    required: false,
  })
  @IsOptional()
  @IsBoolean({ message: 'twoFactorEnabled must be a boolean' })
  twoFactorEnabled?: boolean;

  @ApiProperty({
    example: true,
    description: 'Whether push notifications are enabled',
    required: false,
  })
  @IsOptional()
  @IsBoolean({ message: 'isPushNotificationsEnabled must be a boolean' })
  isPushNotificationsEnabled?: boolean;

  @ApiProperty({
    example: true,
    description: 'Whether email notifications are enabled',
    required: false,
  })
  @IsOptional()
  @IsBoolean({ message: 'isEmailNotificationsEnabled must be a boolean' })
  isEmailNotificationsEnabled?: boolean;
}
