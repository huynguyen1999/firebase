import { PartialType } from '@nestjs/swagger';
import { CreateOrderDto } from './create-order.dto';
import { IsIn, IsNumber, IsOptional } from 'class-validator';
import { ORDER_STATUS } from '../../../constants';

export class UpdateOrderDto extends PartialType(CreateOrderDto) {
  @IsOptional()
  @IsIn(Object.values(ORDER_STATUS))
  status?: string;

  @IsOptional()
  @IsNumber()
  order_date?: number;
}
