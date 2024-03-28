import { PlaceOrderDTO, OrderDto } from '@nest-shared';
import { Injectable } from '@nestjs/common';
import { PlaceOrderSaga } from '../sagas/place-order/place-order.saga';
import { v4 as uuid } from 'uuid';
@Injectable()
export class OrderService {
  public constructor(private readonly placeOrderSaga: PlaceOrderSaga) {}

  public async placeOrder(
    placeOrderDto: PlaceOrderDTO
  ): Promise<{ message: string }> {
    const placedOrder: OrderDto = { ...placeOrderDto, orderId: uuid() };
    await this.placeOrderSaga.init(placedOrder);
    return { message: 'Order has been initiated' };
  }
}
