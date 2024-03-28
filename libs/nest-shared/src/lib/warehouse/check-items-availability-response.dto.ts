export class CheckItemsAvailabilityResponseDto {
  availability: ItemAvailabilityDto[];

  allItemsAvailable: boolean;

  orderId?: string;
}

export class ItemAvailabilityDto {
  itemId: string;

  available: boolean;

  reason?: string;
}
