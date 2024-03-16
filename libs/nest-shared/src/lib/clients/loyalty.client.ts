import { Injectable } from '@nestjs/common';

import axios, { AxiosInstance } from 'axios';
import {
  AssignLoyaltyPointsRequestDto,
  AssignLoyaltyPointsResponseDto,
} from '../loyalty/assign-loyalty-points.dto';

@Injectable()
export class LoyaltyClient {
  private httpClient: AxiosInstance;

  constructor() {
    this.httpClient = axios.create({
      baseURL: 'http://loyalty:3000/api',
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  public async awardPointsToCustomer(
    assignLoyaltyPointsDto: AssignLoyaltyPointsRequestDto
  ): Promise<AssignLoyaltyPointsResponseDto> {
    const response = await this.httpClient.post<AssignLoyaltyPointsResponseDto>(
      '/points',
      assignLoyaltyPointsDto
    );
    return response.data;
  }
}
