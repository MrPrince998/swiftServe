import { IsUUID } from 'class-validator';

export class SoftDeleteUserDto {
  @IsUUID()
  id: string;
}
