import { Type } from 'class-transformer';
import { IsNumber } from 'class-validator';

export class PaginationDto {
  @IsNumber()
  @Type(() => Number)
  page_number: number = 1;

  @IsNumber()
  @Type(() => Number)
  page_size: number = 50;
}
