import { Injectable } from '@nestjs/common';
import { PointsService } from '../services/points.service';
import {
  AssignLoyaltyPointsRequestDto,
  AssignLoyaltyPointsResponseDto,
  OrderRoutingKey,
  RpcResponse,
  awardPointsQueue,
  handleRPCServiceCall,
  orderExchange,
} from '@nest-shared';
import { AmqpConnection, RabbitSubscribe } from '@golevelup/nestjs-rabbitmq';

@Injectable()
export class PointsRMQController {
  constructor(
    private readonly pointsService: PointsService,
    private amqpConnection: AmqpConnection
  ) {}

  @RabbitSubscribe({
    exchange: orderExchange,
    routingKey: OrderRoutingKey.AwardPoints,
    queue: awardPointsQueue,
  })
  public async awardPointsToCustomer(
    assignLoyaltyPointsDto: AssignLoyaltyPointsRequestDto
  ): Promise<void> {
    const response = await handleRPCServiceCall(
      this.pointsService.awardPointsToCustomer(
        assignLoyaltyPointsDto.userId,
        assignLoyaltyPointsDto.paidAmount
      )
    );

    const rpcResponse: RpcResponse<AssignLoyaltyPointsResponseDto> = {
      ...response,
      data: { ...response.data, orderId: assignLoyaltyPointsDto.orderId },
    };
    this.amqpConnection.publish<RpcResponse<AssignLoyaltyPointsResponseDto>>(
      orderExchange,
      OrderRoutingKey.AwardPointsResponse,
      rpcResponse
    );
  }
}
