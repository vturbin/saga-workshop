import { IsString, Min } from 'class-validator';

export class CheckItemsAvailabilityRequestDto {
  @IsString()
  itemId: string; // Unique identifier for the item

  @Min(1)
  quantity: number; // Quantity of the item being ordered
}
