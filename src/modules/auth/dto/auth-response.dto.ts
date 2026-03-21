import { ApiProperty } from '@nestjs/swagger';

export class AuthResponseDto {
  @ApiProperty({
    example: 'Login successful',
    description: 'Success message',
  })
  message: string;

  @ApiProperty({
    example: '/dashboard',
    description: 'URL to redirect after successful authentication',
  })
  redirectTo: string;
}

export class CheckAuthUserDto {
  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
  id: string;

  @ApiProperty({ example: 'user@example.com' })
  email: string;

  @ApiProperty({ example: 'John Doe' })
  fullName: string;

  @ApiProperty({ example: 'USER' })
  role: string;

  @ApiProperty({ example: false })
  isEmployed: boolean;

  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174000',
    required: false,
  })
  restaurantId?: string;

  @ApiProperty({ example: false })
  ownsRestaurant: boolean;

  @ApiProperty({ example: false })
  isAgreementAccepeted: boolean;
}

export class CheckAuthResponseDto {
  @ApiProperty({ example: true })
  authenticated: boolean;

  @ApiProperty({ type: CheckAuthUserDto, required: false })
  data?: CheckAuthUserDto;
}

export class LogoutResponseDto {
  @ApiProperty({
    example: 'Logout successful',
    description: 'Logout success message',
  })
  message: string;

  @ApiProperty({
    example: '/',
    description: 'URL to redirect after successful logout',
  })
  redirectedTo: string;
}

export class EmailVerificationResponseDto {
  @ApiProperty({
    example:
      'If your email is not verified, a verification OTP has been sent to your email address',
    description: 'Email verification request response message',
  })
  message: string;
}

export class VerifyEmailResponseDto {
  @ApiProperty({
    example: 'Email verified successfully',
    description: 'Email verification success message',
  })
  message: string;
}
