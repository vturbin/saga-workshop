import { IsString } from 'class-validator';

export class PaymentIdDto {
  @IsString()
  paymentId: string;
}
