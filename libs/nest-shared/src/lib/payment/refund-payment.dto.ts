import { IsString } from 'class-validator';

export class RefundPaymentDto {
  @IsString()
  paymentId: string;

  @IsString()
  orderId?: string;
}
