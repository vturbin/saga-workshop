import { Injectable } from '@nestjs/common';
import { PlaceOrderSagaState } from './place-order.state';
import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';

@Injectable()
export class PackageItemsState extends PlaceOrderSagaState {
  public constructor(private readonly amqpConnection: AmqpConnection) {
    super(PackageItemsState.name);
  }

  public execute(): Promise<void> {
    throw new Error('Method not implemented.');
  }
  public compensate(): Promise<void> {
    throw new Error('Method not implemented.');
  }
}
