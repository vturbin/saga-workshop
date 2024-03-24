import {
  AssignLoyaltyPointsRequestDto,
  AssignLoyaltyPointsResponseDto,
  LoyaltyClient,
  PackageItemsRequestDto,
  PaymentClient,
  PlaceOrderDTO,
  ProcessPaymentDto,
  WarehouseClient,
} from '@nest-shared';
import { BadRequestException, Injectable } from '@nestjs/common';

@Injectable()
export class OrderService {
  public constructor(
    private readonly loyaltyClient: LoyaltyClient,
    private readonly warehouseClient: WarehouseClient,
    private readonly paymentClient: PaymentClient
  ) {}

  public async placeOrder(
    placeOrderDto: PlaceOrderDTO
  ): Promise<AssignLoyaltyPointsResponseDto> {
    // Check if items in stock
    const availability = await this.warehouseClient.checkItemsAvailability(
      placeOrderDto.items
    );

    if (!availability.allItemsAvailable) {
      throw new BadRequestException('Unfortunately some items are unavailable');
    }

    // Reserve items
    const totalAmount = await this.warehouseClient.reserveItems(
      placeOrderDto.items
    );

    // Process payment
    const paymentDetails: ProcessPaymentDto = {
      ...placeOrderDto.paymentDetails,
      amount: totalAmount,
    };
    const paymentResult = await this.paymentClient.processPayment(
      paymentDetails
    );

    const packageItemsDto: PackageItemsRequestDto = {
      items: placeOrderDto.items,
      shippingAddress: placeOrderDto.shippingAddress,
    };

    // Package and send Order
    await this.warehouseClient.packageItems(packageItemsDto);

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
