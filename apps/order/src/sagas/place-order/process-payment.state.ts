import { HttpException, Injectable, Logger } from '@nestjs/common';
import { PlaceOrderSagaState } from './place-order.state';
import { AmqpConnection, RabbitSubscribe } from '@golevelup/nestjs-rabbitmq';
import {
  OrderIdDto,
  OrderRoutingKey,
  ProcessPaymentDto,
  ProcessPaymentResponseDto,
  RefundPaymentDto,
  RpcResponse,
  handleRpcResponse,
  orderExchange,
  processPaymentResponseQueue,
  refundPaymentResponseQueue,
} from '@nest-shared';
import { SagaTempData } from './place-order.saga';

@Injectable()
export class ProcessPaymentState extends PlaceOrderSagaState {
  public constructor(private readonly amqpConnection: AmqpConnection) {
    super(ProcessPaymentState.name);
  }
  public async execute(orderId: string): Promise<void> {
    Logger.debug(`Executing ${ProcessPaymentState.name}`);
    const tempData: SagaTempData = this.saga.tempData.get(orderId);

    const processPaymentDto: ProcessPaymentDto = {
      ...tempData.placeOrderDto.paymentDetails,
      orderId,
      amount: tempData.paidAmount,
    };
    this.amqpConnection.publish<ProcessPaymentDto>(
      orderExchange,
      OrderRoutingKey.ProcessPayment,
      processPaymentDto
    );
  }

  public async compensate(orderId: string): Promise<void> {
    const tempData = this.saga.tempData.get(orderId);

    Logger.debug(`Compensating ${ProcessPaymentState.name}`);
    const refundPaymentDto: RefundPaymentDto = {
      orderId,
      paymentId: tempData.paymentId,
    };
    this.amqpConnection.publish<RefundPaymentDto>(
      orderExchange,
      OrderRoutingKey.RefundPayment,
      refundPaymentDto
    );
  }

  @RabbitSubscribe({
    exchange: orderExchange,
    routingKey: OrderRoutingKey.ProcessPaymentResponse,
    queue: processPaymentResponseQueue,
  })
  public async handleProcessPaymentResponse(
    response: RpcResponse<ProcessPaymentResponseDto>
  ): Promise<void> {
    try {
      const processPaymentResponseDto = handleRpcResponse(response);
      const tempData: SagaTempData = this.saga.tempData.get(
        processPaymentResponseDto.orderId
      );
      tempData.paymentId = processPaymentResponseDto.paymentId;
      this.saga.tempData.set(processPaymentResponseDto.orderId, tempData);

      this.saga.executeNextStep(this.name, processPaymentResponseDto.orderId);
    } catch (error) {
      const responseToClient: RpcResponse<ProcessPaymentResponseDto> = {
        success: false,
        error: {
          statusCode: (error as HttpException).getStatus(),
          message: (error as HttpException).getResponse() as string,
        },
      };
      // TODO: respond to client with SSE
      Logger.debug(responseToClient);
      this.saga.compensatePreviousStep(this.name, response.data.orderId);
    }
  }

  @RabbitSubscribe({
    exchange: orderExchange,
    routingKey: OrderRoutingKey.RefundPaymentResponse,
    queue: refundPaymentResponseQueue,
  })
  public async handleRefundPaymentResponse(
    response: RpcResponse<OrderIdDto>
  ): Promise<void> {
    this.saga.compensatePreviousStep(this.name, response.data.orderId);
  }
}
