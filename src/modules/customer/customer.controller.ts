import { Controller, Get, Query, Res, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards';
import { GetCustomersDto } from './dtos';
import { CustomerService } from './customer.service';
import { Response } from 'express';

@Controller('customers')
export class CustomerController {
  constructor(private readonly customerService: CustomerService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  async getCustomers(@Query() query: GetCustomersDto, @Res() res: Response) {
    try {
      const data = await this.customerService.getCustomers(query);
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
