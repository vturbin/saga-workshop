import { HttpException, HttpStatus } from '@nestjs/common';
import { AxiosError } from 'axios';

export function handleAxiosError(error: unknown): void {
  if ((error as AxiosError)?.isAxiosError) {
    // Extract the AxiosError
    const axiosError = error as AxiosError;

    if (axiosError.response) {
      // You have access to the original status code and response body
      const statusCode = axiosError.response.status;
      const message =
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (axiosError?.response?.data as any).message || 'External service error';

      // Forward the status code and message by throwing a NestJS HttpException
      throw new HttpException(message, statusCode);
    } else if (axiosError.request) {
      // The request was made but no response was received
      throw new HttpException(
        'No response from external service',
        HttpStatus.SERVICE_UNAVAILABLE
      );
    } else {
      // Something happened in setting up the request that triggered an Error
      throw new HttpException(
        'Error when calling external service',
        HttpStatus.BAD_GATEWAY
      );
    }
  } else {
    // Not an Axios error, throw a generic internal server error
    throw new HttpException(
      'Internal server error',
      HttpStatus.INTERNAL_SERVER_ERROR
    );
  }
}
