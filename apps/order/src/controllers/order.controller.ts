import { Body, Controller, Post } from '@nestjs/common';

import { OrderService } from '../services/order.service';
import { PlaceOrderDTO } from '@nest-shared';

@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post('place-order')
  public async placeOrder(
    @Body() placeOrderDto: PlaceOrderDTO
  ): Promise<{ message: string }> {
    return this.orderService.placeOrder(placeOrderDto);
  }
}
