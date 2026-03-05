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
}

export class CheckAuthResponseDto {
  @ApiProperty({ example: true })
  authenticated: boolean;

  @ApiProperty({ type: CheckAuthUserDto, required: false })
  user?: CheckAuthUserDto;
}

export class LogoutResponseDto {
  @ApiProperty({
    example: 'Logout successful',
    description: 'Logout success message',
  })
  message: string;
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
