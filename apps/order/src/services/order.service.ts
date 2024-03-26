import {
  LoyaltyClient,
  PaymentClient,
  PlaceOrderDTO,
  WarehouseClient,
} from '@nest-shared';
import { Injectable } from '@nestjs/common';
import { PlaceOrderSaga } from '../sagas/place-order/place-order.saga';

@Injectable()
export class OrderService {
  public constructor(
    private readonly loyaltyClient: LoyaltyClient,
    private readonly warehouseClient: WarehouseClient,
    private readonly paymentClient: PaymentClient
  ) {}

  public async placeOrder(
    placeOrderDto: PlaceOrderDTO
  ): Promise<{ message: string }> {
    const placeOrderSaga = new PlaceOrderSaga(
      placeOrderDto,
      this.loyaltyClient,
      this.warehouseClient,
      this.paymentClient
    );
    await placeOrderSaga.init();
    return { message: 'Order has been executed' };
  }
}
