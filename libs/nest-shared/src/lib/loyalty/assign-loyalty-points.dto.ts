import { IsString, Min } from 'class-validator';

export class AssignLoyaltyPointsRequestDto {
  @Min(1)
  paidAmount: number;

  @IsString()
  userId: string;
}

export class AssignLoyaltyPointsResponseDto {
  @Min(1)
  points: number;

  @IsString()
  userId: string;
}
