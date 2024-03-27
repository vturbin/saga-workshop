import { Injectable } from '@nestjs/common';
import { PaymentService } from '../services/payment.service';
import { RabbitRPC } from '@golevelup/nestjs-rabbitmq';
import {
  OrderRoutingKey,
  PaymentIdDto,
  ProcessPaymentDto,
  RefundPaymentDto,
  RpcResponse,
  handleRPCServiceCall,
  orderExchange,
  orderQueue,
} from '@nest-shared';

@Injectable()
export class PaymentRMQController {
  constructor(private readonly paymentService: PaymentService) {}

  @RabbitRPC({
    exchange: orderExchange,
    routingKey: OrderRoutingKey.ProcessPayment,
    queue: orderQueue,
  })
  public async processPayment(
    paymentDetails: ProcessPaymentDto
  ): Promise<RpcResponse<PaymentIdDto>> {
    return handleRPCServiceCall(
      this.paymentService.processPayment(paymentDetails)
    );
  }

  @RabbitRPC({
    exchange: orderExchange,
    routingKey: OrderRoutingKey.RefundPayment,
    queue: orderQueue,
  })
  public async refundPayment(
    refundPaymentDto: RefundPaymentDto
  ): Promise<RpcResponse<void>> {
    return handleRPCServiceCall(
      this.paymentService.refundPayment(refundPaymentDto.paymentId)
    );
  }
}
