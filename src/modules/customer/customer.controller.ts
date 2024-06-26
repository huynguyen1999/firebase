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
import { JwtAuthGuard } from '../auth/guards';
import { CreateCustomerDto, GetCustomersDto, UpdateCustomerDto } from './dtos';
import { CustomerService } from './customer.service';
import { Response } from 'express';
import { Customer } from '../../interfaces';

@UseGuards(JwtAuthGuard)
@Controller('customers')
export class CustomerController {
  constructor(private readonly customerService: CustomerService) {}

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

  @Get(':id')
  async getCustomer(@Param('id') id: string, @Res() res: Response) {
    try {
      const data = await this.customerService.getCustomer(id);
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
  async createCustomer(@Body() body: CreateCustomerDto, @Res() res: Response) {
    try {
      const data = await this.customerService.createCustomer({
        ...body,
      } as Customer);
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
  async updateCustomer(
    @Param('id') id: string,
    @Body() body: UpdateCustomerDto,
    @Res() res: Response,
  ) {
    try {
      const data = await this.customerService.updateCustomer(id, {
        ...body,
      } as Partial<Customer>);
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
  async deleteCustomer(@Param('id') id: string, @Res() res: Response) {
    try {
      const data = await this.customerService.deleteCustomer(id);
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
