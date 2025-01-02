import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { PaginationDto } from 'src/common';
import { PRODUCT_SERVICE } from 'src/config';

@Controller('products')
export class ProductsController {
  constructor(
    @Inject(PRODUCT_SERVICE) private readonly productClient: ClientProxy,
  ) {}

  @Post()
  createProduct() {
    return 'This action adds a new product';
  }

  @Get()
  findAllProducts(@Query() paginationDto: PaginationDto) {
    return this.productClient.send({ cmd: 'find_all_products' }, paginationDto);
  }

  @Get(':id')
  async findOneProduct(@Param('id') id: string) {
    try {
      const product = await firstValueFrom(
        this.productClient.send({ cmd: 'find_one_products' }, { id }),
      );
      return product;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  @Delete(':id')
  deleteProduct(@Param('id') id: string) {
    return 'This action removes a product with the id: ' + id;
  }

  @Patch(':id')
  updateProduct(@Param('id') id: string, @Body() body: any) {
    return 'This action updates a product with the id: ' + id;
  }
}
