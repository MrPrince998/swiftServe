import { IsString } from "class-validator";

export class CreateAuthDto {
    @IsString()
    email: string;

    @IsString()
    password: string;

    @IsString()
    role: string;
}
