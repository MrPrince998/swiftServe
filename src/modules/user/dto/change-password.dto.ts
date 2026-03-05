import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, MinLength, Matches } from 'class-validator';
import { Transform } from 'class-transformer';

export class ChangePasswordDto {
  @ApiProperty({
    example: 'currentPassword123',
    description: 'Current password',
  })
  @IsString({ message: 'Current password must be a string' })
  @IsNotEmpty({ message: 'Current password is required' })
  @Transform(({ value }) => value?.trim())
  currentPassword: string;

  @ApiProperty({
    example: 'newPassword123!',
    description: 'New password (minimum 8 characters)',
  })
  @IsString({ message: 'New password must be a string' })
  @IsNotEmpty({ message: 'New password is required' })
  @MinLength(8, { message: 'New password must be at least 8 characters long' })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, {
    message:
      'New password must contain at least one lowercase letter, one uppercase letter, and one number',
  })
  @Transform(({ value }) => value?.trim())
  newPassword: string;

  @ApiProperty({
    example: 'newPassword123!',
    description: 'Confirm new password',
  })
  @IsString({ message: 'Confirm password must be a string' })
  @IsNotEmpty({ message: 'Confirm password is required' })
  @Transform(({ value }) => value?.trim())
  confirmPassword: string;
}
