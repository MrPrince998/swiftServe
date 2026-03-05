import { ApiProperty } from '@nestjs/swagger';
import { restaurantStatus } from 'src/shared/interfaces/restaurant.interface';

export class RestaurantResponseDto {
  @ApiProperty({
    example: '550e8400-e29b-41d4-a716-446655440000',
    description: 'Unique identifier for the restaurant',
  })
  id: string;

  @ApiProperty({
    example: 'Pizza Palace',
    description: 'Name of the restaurant',
  })
  restaurantName: string;

  @ApiProperty({
    example: 'contact@pizzapalace.com',
    description: 'Email address of the restaurant',
  })
  restaurantEmail: string;

  @ApiProperty({
    example: '+1234567890',
    description: 'Phone number of the restaurant',
    required: false,
  })
  restaurantPhone?: string;

  @ApiProperty({
    example: '123 Main St, Anytown, USA',
    description: 'Physical address of the restaurant',
  })
  restaurantAddress: string;

  @ApiProperty({
    example: 'https://pizzapalace.com',
    description: 'URL of the restaurant website',
    required: false,
  })
  websiteUrl?: string;

  @ApiProperty({
    example: 'https://example.com/logo.png',
    description: 'URL to the restaurant logo',
    required: false,
  })
  restaurantLogoURL?: string;

  @ApiProperty({
    enum: restaurantStatus,
    example: restaurantStatus.ACTIVE,
    description: 'Current status of the restaurant',
  })
  restaurantStatus: restaurantStatus;

  @ApiProperty({
    example: '550e8400-e29b-41d4-a716-446655440001',
    description: 'ID of the restaurant owner',
    required: false,
  })
  ownerId?: string;
}

export class RestaurantDeleteResponseDto {
  @ApiProperty({
    example: 'Restaurant deleted successfully',
    description: 'Confirmation message for restaurant deletion',
  })
  message: string;
}

export class RestaurantApiResponseDto {
  @ApiProperty({
    example: 'Restaurant created successfully',
    description: 'Response message',
  })
  message: string;

  @ApiProperty({
    type: RestaurantResponseDto,
    description: 'Restaurant data',
  })
  data: RestaurantResponseDto;
}

export class RestaurantDeleteApiResponseDto {
  @ApiProperty({
    example: 'Restaurant deleted successfully',
    description: 'Response message',
  })
  message: string;

  @ApiProperty({
    type: RestaurantDeleteResponseDto,
    description: 'Delete confirmation data',
  })
  data: RestaurantDeleteResponseDto;
}
