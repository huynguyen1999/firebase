import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class GetCustomersDto {
  @IsString()
  @IsOptional()
  @IsNotEmpty()
  phone_number?: string;

  @IsString()
  @IsOptional()
  @IsNotEmpty()
  name?: string;
}
