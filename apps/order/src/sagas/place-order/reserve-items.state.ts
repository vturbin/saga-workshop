import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';
import { Injectable } from '@nestjs/common';
import { PlaceOrderSagaState } from './place-order.state';

@Injectable()
export class ReserveItemsState extends PlaceOrderSagaState {
  public constructor(private readonly amqpConnection: AmqpConnection) {
    super(ReserveItemsState.name);
  }

  public execute(): Promise<void> {
    throw new Error('Method not implemented.');
  }
  public compensate(): Promise<void> {
    throw new Error('Method not implemented.');
  }
}
