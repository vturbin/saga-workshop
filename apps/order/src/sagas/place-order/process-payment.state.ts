import { PlaceOrderSagaState } from './place-order.state';

export class ProcessPaymentState extends PlaceOrderSagaState {
  public execute(): Promise<void> {
    throw new Error('Method not implemented.');
  }
  public compensate(): Promise<void> {
    throw new Error('Method not implemented.');
  }
}
