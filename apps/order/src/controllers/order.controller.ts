import { Body, Controller, Post } from '@nestjs/common';

import { OrderService } from '../services/order.service';
import { AssignLoyaltyPointsResponseDto, PlaceOrderDTO } from '@nest-shared';

@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post('place-order')
  public async placeOrder(
    @Body() placeOrderDto: PlaceOrderDTO
  ): Promise<AssignLoyaltyPointsResponseDto> {
    return this.orderService.placeOrder(placeOrderDto);
  }
}
