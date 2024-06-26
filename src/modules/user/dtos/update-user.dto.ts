import { IsIn, IsOptional, IsString } from 'class-validator';
import { UpdateProfileDto } from '../../auth/dtos';
import { USER_ROLES } from '../../../constants';

export class UpdateUserDto extends UpdateProfileDto {
  @IsString()
  @IsOptional()
  @IsIn(Object.values(USER_ROLES))
  role?: string;
}
