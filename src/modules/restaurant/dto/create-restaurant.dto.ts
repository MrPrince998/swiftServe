import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  Matches,
} from 'class-validator';

export class CreateRestaurantDto {
  @ApiProperty({
    example: 'Pizza Palace',
    description: 'Name of the restaurant',
  })
  @IsString({ message: 'Restaurant name must be a string' })
  @IsNotEmpty({ message: 'Restaurant name is required' })
  @Transform(({ value }) => value?.trim())
  restaurantName: string;

  @ApiProperty({
    example: 'https://pizzapalace.com',
    description: 'URL of the restaurant website',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'Website URL must be a string' })
  @IsUrl({}, { message: 'Website URL must be a valid URL' })
  @Transform(({ value }) => value?.trim())
  websiteUrl?: string;

  @ApiProperty({
    example: 'contact@pizzapalace.com',
    description: 'Email address of the restaurant',
  })
  @IsString({ message: 'Restaurant email must be a string' })
  @IsNotEmpty({ message: 'Restaurant email is required' })
  @IsEmail({}, { message: 'Restaurant email must be a valid email address' })
  @Transform(({ value }) => value?.trim().toLowerCase())
  restaurantEmail: string;

  @ApiProperty({
    example: '+1234567890',
    description: 'Phone number of the restaurant',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'Restaurant phone number must be a string' })
  @Matches(/^[+]?[1-9]\d{1,14}$/, {
    message: 'Restaurant phone number must be a valid international format',
  })
  @Transform(({ value }) => value?.trim())
  restaurantPhone?: string;

  @ApiProperty({
    example: '123 Main St, Anytown, USA',
    description: 'Physical address of the restaurant',
  })
  @IsString({ message: 'Restaurant address must be a string' })
  @IsNotEmpty({ message: 'Restaurant address is required' })
  @Transform(({ value }) => value?.trim())
  restaurantAddress: string;
}
