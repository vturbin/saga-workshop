import { Injectable } from '@nestjs/common';
import { PlaceOrderSagaState } from './place-order.state';
import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';

@Injectable()
export class AwardPointsToCustomerState extends PlaceOrderSagaState {
  public constructor(private readonly amqpConnection: AmqpConnection) {
    super(AwardPointsToCustomerState.name);
  }
  public execute(): Promise<void> {
    throw new Error('Method not implemented.');
  }
  public compensate(): Promise<void> {
    throw new Error('Method not implemented.');
  }
}
