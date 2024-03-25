import { Injectable } from '@nestjs/common';

import axios, { AxiosInstance } from 'axios';
import {
  AssignLoyaltyPointsRequestDto,
  AssignLoyaltyPointsResponseDto,
} from '../loyalty/assign-loyalty-points.dto';
import { handleAxiosError } from '../utils/handle-http-error';

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
    try {
      const response =
        await this.httpClient.post<AssignLoyaltyPointsResponseDto>(
          '/points',
          assignLoyaltyPointsDto
        );
      return response.data;
    } catch (error) {
      throw handleAxiosError(error);
    }
  }
}
