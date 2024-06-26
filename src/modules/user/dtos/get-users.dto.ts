import { IsIn, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { USER_ROLES } from '../../../constants';
import { PaginationDto } from '../../../dtos';

export class GetUsersDto extends PaginationDto {
  @IsString()
  @IsOptional()
  @IsNotEmpty()
  email?: string;

  @IsString()
  @IsOptional()
  @IsNotEmpty()
  phone_number?: string;

  @IsString()
  @IsOptional()
  @IsIn(Object.values(USER_ROLES))
  role?: string;

  @IsString()
  @IsOptional()
  @IsNotEmpty()
  name?: string;
}
