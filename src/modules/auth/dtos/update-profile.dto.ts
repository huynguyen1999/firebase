import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpdateProfileDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  phone_number?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  name?: string;
}
