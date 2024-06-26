import { Controller, Get, Query, Res, UseGuards } from '@nestjs/common';
import { ProductService } from './product.service';
import { JwtAuthGuard } from '../auth/guards';
import { Response } from 'express';
import { GetProductsDto } from './dtos';

@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @UseGuards(JwtAuthGuard)
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
}
