import {
  LoyaltyClient,
  PaymentClient,
  PlaceOrderDTO,
  WarehouseClient,
} from '@nest-shared';
import { PlaceOrderSagaState } from './place-order.state';
import { CheckItemsAvailabilityState } from './check-items-availability.state';

export class PlaceOrderSaga {
  private state: PlaceOrderSagaState;

  public constructor(
    public placeOrderDto: PlaceOrderDTO,
    public readonly loyaltyClient: LoyaltyClient,
    public readonly warehouseClient: WarehouseClient,
    public readonly paymentClient: PaymentClient
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
