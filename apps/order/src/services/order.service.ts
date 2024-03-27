import { PlaceOrderDTO } from '@nest-shared';
import { Injectable } from '@nestjs/common';
import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';
import { PlaceOrderSaga } from '../sagas/place-order/place-order.saga';

@Injectable()
export class OrderService {
  public constructor(private readonly amqpConnection: AmqpConnection) {}

  public async placeOrder(
    placeOrderDto: PlaceOrderDTO
  ): Promise<{ message: string }> {
    // Check if items in stock
    const saga = new PlaceOrderSaga(placeOrderDto, this.amqpConnection);
    await saga.init();
    return { message: 'Order has been executed' };
  }
}
