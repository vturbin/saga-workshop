export class CheckItemsAvailabilityResponseDto {
  availability: ItemAvailabilityDto[];

  allItemsAvailable: boolean;
}

export class ItemAvailabilityDto {
  itemId: string;

  available: boolean;

  reason?: string;
}
