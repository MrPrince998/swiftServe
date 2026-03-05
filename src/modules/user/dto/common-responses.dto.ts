import { ApiProperty } from '@nestjs/swagger';

export class UserDeleteResponseDto {
  @ApiProperty({
    example: 'User deleted successfully',
    description: 'Success message',
  })
  message: string;
}

export class PasswordChangeResponseDto {
  @ApiProperty({
    example: 'Password changed successfully',
    description: 'Success message',
  })
  message: string;
}

export class ProfileUpdateResponseDto {
  @ApiProperty({
    example: 'Profile updated successfully',
    description: 'Success message',
  })
  message: string;

  @ApiProperty({
    description: 'Updated user data',
  })
  user: any; // This will be UserResponseDto instance
}
