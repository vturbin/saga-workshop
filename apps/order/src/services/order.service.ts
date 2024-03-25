import {
  AssignLoyaltyPointsRequestDto,
  AssignLoyaltyPointsResponseDto,
  LoyaltyClient,
  PackageItemsRequestDto,
  PaymentClient,
  PaymentIdDto,
  PlaceOrderDTO,
  ProcessPaymentDto,
  RefundPaymentDto,
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
    const reserveItemsResponse = await this.warehouseClient.reserveItems(
      placeOrderDto.items
    );

    let paymentDetails: ProcessPaymentDto;
    let processPaymentResult: PaymentIdDto;

    try {
      // Process payment
      paymentDetails = {
        ...placeOrderDto.paymentDetails,
        amount: reserveItemsResponse.totalAmount,
      };
      processPaymentResult = await this.paymentClient.processPayment(
        paymentDetails
      );
    } catch (error) {
      // Could not process payment. Should roll back now
      await this.warehouseClient.cancelItemsReservation(placeOrderDto.items);
      throw error;
    }

    try {
      const packageItemsDto: PackageItemsRequestDto = {
        items: placeOrderDto.items,
        shippingAddress: placeOrderDto.shippingAddress,
      };

      // Package items
      await this.warehouseClient.packageItems(packageItemsDto);
    } catch (error) {
      const refundPaymentDto: RefundPaymentDto = {
        paymentId: processPaymentResult.paymentId,
      };
      await this.paymentClient.refundPayment(refundPaymentDto);
      await this.warehouseClient.cancelItemsReservation(placeOrderDto.items);
      throw error;
    }

    try {
      // award loyalty Points to customer
      const assignLoyaltyPoints: AssignLoyaltyPointsRequestDto = {
        paidAmount: paymentDetails.amount,
        userId: placeOrderDto.customerId,
      };
      const totalPoints = await this.loyaltyClient.awardPointsToCustomer(
        assignLoyaltyPoints
      );

      return totalPoints;
    } catch (error) {
      // Do we actually need to revert the whole operation if points were not awarded to the customer?
      console.log(error);
      throw error;
    }
  }
}
