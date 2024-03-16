import { IsString, ValidateNested } from 'class-validator';
import { OrderItemDto } from './order-item.dto';
import { PaymentDetailsDto } from './payment-details.dto';
import { ShippingAddressDto } from './shipping-address.dto';
import { Type } from 'class-transformer';

export class PlaceOrderDTO {
  @IsString()
  customerId: string; // Unique identifier for the customer placing the order

  @ValidateNested()
  @Type(() => PaymentDetailsDto)
  paymentDetails: PaymentDetailsDto; // Payment information required to charge the customer

  @ValidateNested()
  @Type(() => OrderItemDto)
  items: OrderItemDto[]; // List of items being ordered

  @ValidateNested()
  @Type(() => ShippingAddressDto)
  shippingAddress: ShippingAddressDto; // Shipping address for the order
}
