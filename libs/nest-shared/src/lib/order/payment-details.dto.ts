import {
  IsDateString,
  IsEnum,
  Length,
  ValidateNested,
  IsCreditCard,
  IsEmail,
  IsString,
} from 'class-validator';
import { BillingAddressDto } from './billing-address.dto';
import { Type } from 'class-transformer';
import { PaymentMethod } from '../payment/enums/payment-method.enum';

export class PaymentDetailsDto {
  @IsEnum(PaymentMethod)
  method: PaymentMethod;

  @IsEmail()
  email?: string; // Optional, PayPal email address

  @IsString()
  payerId?: string; // PayPal's Payer ID, if available

  @IsString()
  paymentToken?: string; // A token from PayPal to authorize the payment

  @IsCreditCard()
  cardNumber?: string; // Optional, depending on payment method

  @IsDateString()
  expirationDate?: Date; // Optional, depending on payment method

  @Length(3)
  cvv?: string; // Optional, security code for the payment method

  @ValidateNested()
  @Type(() => BillingAddressDto)
  billingAddress?: BillingAddressDto; // Optional, required if different from shipping address
}
