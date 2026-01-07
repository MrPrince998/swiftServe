import { IsNotEmpty, IsString } from 'class-validator'
export class RefreshTokenDto {
    @IsNotEmpty({ message: 'Refresh token is required' })
    @IsString({ message: 'Refresh token must be a string' })
    refreshToken: string;
}

export class RefreshTokenResponseDto {
    accessToken: string;
    refreshToken?: string;
    tokenType: string;
    expiresIn: number;
    user: {
        id: string;
        email: string;
        username: string;
        role: string;
    }
}   