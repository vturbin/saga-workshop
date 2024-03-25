import { Injectable } from '@nestjs/common';
import axios, { AxiosInstance } from 'axios';
import { ProcessPaymentDto } from '../payment/process-payment.dto';
import { PaymentIdDto } from '../payment/payment-id.dto';
import { RefundPaymentDto } from '../payment/refund-payment.dto';
import { handleAxiosError } from '../utils/handle-http-error';

@Injectable()
export class PaymentClient {
  private httpClient: AxiosInstance;

  constructor() {
    this.httpClient = axios.create({
      baseURL: 'http://payment:3000/api',
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  public async processPayment(
    paymentDetails: ProcessPaymentDto
  ): Promise<PaymentIdDto> {
    try {
      const response = await this.httpClient.post<PaymentIdDto>(
        'payment/process-payment',
        paymentDetails
      );
      return response.data;
    } catch (error) {
      throw handleAxiosError(error);
    }
  }

  public async refundPayment(
    refundPaymentDto: RefundPaymentDto
  ): Promise<void> {
    try {
      const response = await this.httpClient.post<void>(
        'payment/refund-payment',
        refundPaymentDto
      );
      return response.data;
    } catch (error) {
      throw handleAxiosError(error);
    }
  }
}
