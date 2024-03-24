import { Injectable } from '@nestjs/common';
import axios, { AxiosInstance } from 'axios';
import { ProcessPaymentDto } from '../payment/process-payment.dto';
import { PaymentIdDto } from '../payment/payment-id.dto';
import { RefundPaymentDto } from '../payment/refund-payment.dto';

@Injectable()
export class PaymentClient {
  private httpClient: AxiosInstance;

  constructor() {
    this.httpClient = axios.create({
      baseURL: 'http://payment:3000/api/payment',
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  public async processPayment(
    paymentDetails: ProcessPaymentDto
  ): Promise<PaymentIdDto> {
    const response = await this.httpClient.post<PaymentIdDto>(
      '/process-payment',
      paymentDetails
    );
    return response.data;
  }

  public async refundPayment(
    refundPaymentDto: RefundPaymentDto
  ): Promise<void> {
    const response = await this.httpClient.post<void>(
      '/process-payment',
      refundPaymentDto
    );
    return response.data;
  }
}
