import { Controller, Get, Query, Res, UseGuards } from '@nestjs/common';
import { OrderService } from './order.service';
import { GetOrdersDto } from './dtos';
import { Response } from 'express';
import { JwtAuthGuard } from '../auth/guards';

@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  async getOrders(@Query() query: GetOrdersDto, @Res() res: Response) {
    try {
      const data = await this.orderService.getOrders(query);
      res.status(200).json({ data, success: true }).end();
    } catch (exception) {
      console.log(exception);
      res
        .status(400)
        .json({ message: exception.message ?? 'Unknown error' })
        .end();
    }
  }
}
