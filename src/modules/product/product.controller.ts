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
import { ProductService } from './product.service';
import { JwtAuthGuard } from '../auth/guards';
import { Response } from 'express';
import { CreateProductDto, GetProductsDto, UpdateProductDto } from './dtos';
import { Product } from '../../interfaces';

@UseGuards(JwtAuthGuard)
@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get()
  async getProducts(@Query() query: GetProductsDto, @Res() res: Response) {
    try {
      const data = await this.productService.getProducts(query);
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
  async getProduct(@Param('id') id: string, @Res() res: Response) {
    try {
      const data = await this.productService.getProduct(id);
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
  async createProduct(@Body() body: CreateProductDto, @Res() res: Response) {
    try {
      const data = await this.productService.createProduct({
        ...body,
      } as Product);
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
  async updateProduct(
    @Param('id') id: string,
    @Body() body: UpdateProductDto,
    @Res() res: Response,
  ) {
    try {
      const data = await this.productService.updateProduct(id, body);
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
  async deleteProduct(@Param('id') id: string, @Res() res: Response) {
    try {
      await this.productService.deleteProduct(id);
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
