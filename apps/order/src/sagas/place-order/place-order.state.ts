import { PlaceOrderSaga } from './place-order.saga';

export abstract class PlaceOrderSagaState {
  public saga: PlaceOrderSaga;

  public setContext(saga: PlaceOrderSaga) {
    this.saga = saga;
  }

  public abstract execute(): Promise<void>;

  public abstract compensate(): Promise<void>;
}
