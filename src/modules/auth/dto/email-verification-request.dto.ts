import { IsEmail, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

export class EmailVerificationRequestDto {
  // This DTO is intentionally empty as the email is extracted from JWT token
  // The endpoint uses @UseGuards(JwtGuard) so user email comes from the authenticated user
}
