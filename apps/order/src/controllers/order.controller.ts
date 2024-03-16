import { Body, Controller, Post } from '@nestjs/common';

import { OrderService } from '../services/order.service';
import {
  AssignLoyaltyPointsRequestDto,
  AssignLoyaltyPointsResponseDto,
  PlaceOrderDTO,
  LoyaltyClient,
  WarehouseClient,
} from '@nest-shared';

@Controller('order')
export class OrderController {
  constructor(
    private readonly orderService: OrderService,
    private readonly loyaltyClient: LoyaltyClient,
    private readonly warehouseClient: WarehouseClient
  ) {}

  @Post('place-order')
  public async placeOrder(
    @Body() placeOrderDto: PlaceOrderDTO
  ): Promise<AssignLoyaltyPointsResponseDto> {
    // Check if items in stock
    this.warehouseClient.checkItemsAvailability(placeOrderDto.items);

    // // Process payment
    // const paymentResult = await this.paymentClient.processPayment();

    // // Package and send Order
    // const orderPackaged = await this.warehouseClient.packageItems(
    //   placeOrderDto.items,
    //   placeOrderDto.shippingAddress
    // );

    // award loyalty Points to customer
    const assignLoyaltyPoints: AssignLoyaltyPointsRequestDto = {
      paidAmount: 1000,
      userId: placeOrderDto.customerId,
    };
    const pointsAwarded = await this.loyaltyClient.awardPointsToCustomer(
      assignLoyaltyPoints
    );
    return pointsAwarded;
  }
}
