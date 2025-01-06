import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Inject,
  ParseUUIDPipe,
  Query,
  ParseEnumPipe,
  Patch,
} from '@nestjs/common';
import { ORDER_SERVICE } from 'src/config';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { catchError } from 'rxjs';
import { PaginationDto } from 'src/common';
import { CreateOrderDto, OrderPaginationDto } from './dto';
import { OrderStatus } from './enum/order.enum';
import { OrderStatusDto } from './dto/order-status.dto';

@Controller('orders')
export class OrdersController {
  constructor(
    @Inject(ORDER_SERVICE) private readonly orderClient: ClientProxy,
  ) {}

  @Post()
  create(@Body() createOrderDto: CreateOrderDto) {
    return this.orderClient.send('createOrder', createOrderDto).pipe(
      catchError((err) => {
        throw new RpcException(err);
      }),
    );
  }

  @Get()
  findAll(@Query() orderPaginationDto: OrderPaginationDto) {
    return this.orderClient.send('findAllOrders', orderPaginationDto).pipe(
      catchError((err) => {
        throw new RpcException(err);
      }),
    );
  }

  @Get('id/:id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.orderClient.send('findOneOrder', { id }).pipe(
      catchError((err) => {
        throw new RpcException(err);
      }),
    );
  }

  @Get(':status')
  findAllByStatus(
    @Param('status', new ParseEnumPipe(OrderStatus)) status: OrderStatus,
    @Query() paginationDto: PaginationDto,
  ) {
    return this.orderClient
      .send('findAllOrders', { ...paginationDto, status })
      .pipe(
        catchError((err) => {
          throw new RpcException(err);
        }),
      );
  }

  @Patch(':id')
  changeStatus(
    @Param('id', ParseUUIDPipe) id: string,
    @Body('status') status: OrderStatusDto,
  ) {
    return this.orderClient.send('changeOrderStatus', { id, status }).pipe(
      catchError((err) => {
        throw new RpcException(err);
      }),
    );
  }
}
