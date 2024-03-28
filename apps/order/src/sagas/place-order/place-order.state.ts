import { PlaceOrderSaga } from './place-order.saga';

export abstract class PlaceOrderSagaState {
  public saga: PlaceOrderSaga;

  public constructor(public readonly name: string) {
    this.name = name;
  }

  public setContext(saga: PlaceOrderSaga) {
    this.saga = saga;
  }

  public abstract execute(orderId: string): Promise<void>;

  public abstract compensate(orderId: string): Promise<void>;
}
