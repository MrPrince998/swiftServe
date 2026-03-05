import { ApiProperty } from '@nestjs/swagger';
import {
  IsOptional,
  IsString,
  IsEmail,
  IsUrl,
  IsPhoneNumber,
} from 'class-validator';
import { Transform } from 'class-transformer';

export class UpdateProfileDto {
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
    example: 'https://example.com/avatar.jpg',
    description: 'Profile image URL',
    required: false,
  })
  @IsOptional()
  @IsUrl({}, { message: 'Image URL must be a valid URL' })
  imageUrl?: string;
}
