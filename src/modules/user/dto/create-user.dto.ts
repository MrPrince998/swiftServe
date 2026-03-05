import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  MinLength,
  Matches,
} from 'class-validator';
import { userRole } from 'src/shared/interfaces/user.interface';

export class CreateUserDto {
  @ApiProperty({
    example: 'John Doe',
    description: 'Full name of the user',
  })
  @IsString({ message: 'Full name must be a string' })
  @IsNotEmpty({ message: 'Full name is required' })
  @Transform(({ value }) => value?.trim())
  fullName: string;

  @ApiProperty({
    example: 'john.doe@example.com',
    description: 'Email address',
  })
  @IsEmail({}, { message: 'Email must be a valid email address' })
  @IsNotEmpty({ message: 'Email is required' })
  @Transform(({ value }) => value?.trim().toLowerCase())
  email: string;

  @ApiProperty({
    example: 'Password123!',
    description: 'Password (minimum 8 characters)',
  })
  @IsString({ message: 'Password must be a string' })
  @IsNotEmpty({ message: 'Password is required' })
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, {
    message:
      'Password must contain at least one lowercase letter, one uppercase letter, and one number',
  })
  @Transform(({ value }) => value?.trim())
  password: string;

  @ApiProperty({
    enum: userRole,
    example: userRole.USER,
    description: 'User role',
  })
  @IsEnum(userRole, { message: 'Role must be a valid user role' })
  @IsNotEmpty({ message: 'Role is required' })
  role: userRole;

  @ApiProperty({
    example: '+1234567890',
    description: 'Phone number',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'Phone number must be a string' })
  @Transform(({ value }) => value?.trim())
  phoneNumber?: string;
}
