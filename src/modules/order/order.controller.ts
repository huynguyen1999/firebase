import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Res,
  UseGuards,
} from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto, GetOrdersDto, UpdateOrderDto } from './dtos';
import { Response } from 'express';
import { JwtAuthGuard } from '../auth/guards';

@UseGuards(JwtAuthGuard)
@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

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

  @Get(':id')
  async getOrder(@Param('id') id: string, @Res() res: Response) {
    try {
      const data = await this.orderService.getOrder(id);
      res.status(200).json({ data, success: true }).end();
    } catch (exception) {
      console.log(exception);
      res
        .status(400)
        .json({ message: exception.message ?? 'Unknown error' })
        .end();
    }
  }

  @Post()
  async createOrder(@Body() body: CreateOrderDto, @Res() res: Response) {
    try {
      const data = await this.orderService.createOrder(body);
      res.status(200).json({ data, success: true }).end();
    } catch (exception) {
      console.log(exception);
      res
        .status(400)
        .json({ message: exception.message ?? 'Unknown error' })
        .end();
    }
  }

  @Put(':id')
  async updateOrder(
    @Param('id') id: string,
    @Body() body: UpdateOrderDto,
    @Res() res: Response,
  ) {
    try {
      const data = await this.orderService.updateOrder(id, body);
      res.status(200).json({ data, success: true }).end();
    } catch (exception) {
      console.log(exception);
      res
        .status(400)
        .json({ message: exception.message ?? 'Unknown error' })
        .end();
    }
  }

  @Delete(':id')
  async deleteOrder(@Param('id') id: string, @Res() res: Response) {
    try {
      await this.orderService.deleteOrder(id);
      res.status(200).json({ success: true }).end();
    } catch (exception) {
      console.log(exception);
      res
        .status(400)
        .json({ message: exception.message ?? 'Unknown error' })
        .end();
    }
  }
}
