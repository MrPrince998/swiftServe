import { IsString, IsUUID } from "class-validator";

export class CreateUserDto {
    @IsUUID()
    id: string;

}
