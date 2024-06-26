import { Transform } from 'class-transformer';
import { IsNumber, IsOptional } from 'class-validator';

export class NumberRangeDto {
  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => {
    console.log(value);
    return value;
  })
  from?: number;

  @IsOptional()
  @IsNumber()
  to?: number;
}
