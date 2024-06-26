import {
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { NumberRangeDto } from '../../../dtos/number-range.dto';
import { Transform, Type, plainToClass } from 'class-transformer';
import { PaginationDto } from '../../../dtos';

export class GetProductsDto extends PaginationDto {
  @IsString()
  @IsOptional()
  @IsNotEmpty()
  description?: string;

  @IsString()
  @IsOptional()
  @IsNotEmpty()
  name?: string;

  @IsOptional()
  @Transform(
    ({ value }) => {
      try {
        const parsedValue = JSON.parse(value);
        return plainToClass(NumberRangeDto, parsedValue);
      } catch {
        return value;
      }
    },
    { toClassOnly: true },
  )
  @Type(() => NumberRangeDto)
  @ValidateNested()
  stock_quantity?: NumberRangeDto;

  @IsOptional()
  @ValidateNested()
  @Transform(
    ({ value }) => {
      try {
        const parsedValue = JSON.parse(value);
        return plainToClass(NumberRangeDto, parsedValue);
      } catch {
        return value;
      }
    },
    { toClassOnly: true },
  )
  @Type(() => NumberRangeDto)
  price?: NumberRangeDto;
}
