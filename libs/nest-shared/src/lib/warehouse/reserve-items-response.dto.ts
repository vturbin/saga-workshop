import { IsNumber } from 'class-validator';

export class ReserveItemsResponseDto {
  @IsNumber()
  totalAmount: number;
}
