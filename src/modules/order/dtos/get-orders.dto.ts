import {
  IsIn,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { ORDER_STATUS } from '../../../constants';
import { NumberRangeDto } from '../../../dtos/number-range.dto';
import { Transform, Type, plainToClass } from 'class-transformer';

export class GetOrdersDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  employee_id?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  customer_id?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  product_id?: string;

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
  quantity?: NumberRangeDto;

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
  order_date?: NumberRangeDto;

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
  total_amount?: NumberRangeDto;

  @IsOptional()
  @IsString()
  @IsIn(Object.values(ORDER_STATUS))
  status?: string;
}
