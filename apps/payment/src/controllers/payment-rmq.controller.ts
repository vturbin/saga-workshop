import { Injectable } from '@nestjs/common';
import { PaymentService } from '../services/payment.service';
import { AmqpConnection, RabbitSubscribe } from '@golevelup/nestjs-rabbitmq';
import {
  OrderIdDto,
  OrderRoutingKey,
  ProcessPaymentDto,
  ProcessPaymentResponseDto,
  RefundPaymentDto,
  RpcResponse,
  handleRPCServiceCall,
  orderExchange,
  processPaymentQueue,
  refundPaymentQueue,
} from '@nest-shared';

@Injectable()
export class PaymentRMQController {
  constructor(
    private readonly paymentService: PaymentService,
    private amqpConnection: AmqpConnection
  ) {}

  @RabbitSubscribe({
    exchange: orderExchange,
    routingKey: OrderRoutingKey.ProcessPayment,
    queue: processPaymentQueue,
  })
  public async processPayment(
    paymentDetails: ProcessPaymentDto
  ): Promise<void> {
    const response = await handleRPCServiceCall(
      this.paymentService.processPayment(paymentDetails)
    );
    const rpcResponse: RpcResponse<ProcessPaymentResponseDto> = {
      ...response,
      data: { ...response.data, orderId: paymentDetails.orderId },
    };
    this.amqpConnection.publish<RpcResponse<ProcessPaymentResponseDto>>(
      orderExchange,
      OrderRoutingKey.ProcessPaymentResponse,
      rpcResponse
    );
  }

  @RabbitSubscribe({
    exchange: orderExchange,
    routingKey: OrderRoutingKey.RefundPayment,
    queue: refundPaymentQueue,
  })
  public async refundPayment(
    refundPaymentDto: RefundPaymentDto
  ): Promise<void> {
    const response = await handleRPCServiceCall(
      this.paymentService.refundPayment(refundPaymentDto.paymentId)
    );
    const rpcResponse: RpcResponse<OrderIdDto> = {
      ...response,
      data: { orderId: refundPaymentDto.orderId },
    };
    this.amqpConnection.publish<RpcResponse<OrderIdDto>>(
      orderExchange,
      OrderRoutingKey.RefundPaymentResponse,
      rpcResponse
    );
  }
}
