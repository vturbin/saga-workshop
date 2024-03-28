import { Body, Controller, Post, Sse } from '@nestjs/common';

import { OrderService } from '../services/order.service';
import { PlaceOrderDTO, RpcResponse } from '@nest-shared';
import { Observable, Subject } from 'rxjs';

@Controller('order')
export class OrderController {
  private eventSubject = new Subject<RpcResponse<unknown>>();

  constructor(private readonly orderService: OrderService) {}

  @Post('place-order')
  public async placeOrder(
    @Body() placeOrderDto: PlaceOrderDTO
  ): Promise<{ message: string }> {
    return this.orderService.placeOrder(placeOrderDto);
  }

  @Sse('place-order-result')
  private subscribe(): Observable<RpcResponse<unknown>> {
    return this.eventSubject.asObservable();
  }

  public sendEvent(data: RpcResponse<unknown>): void {
    this.eventSubject.next(data);
  }
}
