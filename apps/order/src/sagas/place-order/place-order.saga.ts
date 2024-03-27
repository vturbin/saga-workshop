import { PlaceOrderDTO } from '@nest-shared';
import { PlaceOrderSagaState } from './place-order.state';
import { CheckItemsAvailabilityState } from './check-items-availability.state';
import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';

export class PlaceOrderSaga {
  private state: PlaceOrderSagaState;

  public constructor(
    public placeOrderDto: PlaceOrderDTO,
    public readonly amqpConnection: AmqpConnection
  ) {
    this.setState(new CheckItemsAvailabilityState());
  }

  public setState(state: PlaceOrderSagaState) {
    this.state = state;
    this.state.setContext(this);
  }

  public getState() {
    return this.state;
  }

  public async init(): Promise<void> {
    await this.state.execute();
  }
}
