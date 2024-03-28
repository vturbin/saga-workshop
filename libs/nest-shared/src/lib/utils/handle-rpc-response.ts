import {
  BadRequestException,
  HttpException,
  NotFoundException,
} from '@nestjs/common';
import { RpcResponse } from '../interfaces/rpc-response.interface';

export function handleRpcResponse<T>(rpcResponse: RpcResponse<T>): T {
  if (rpcResponse.error) {
    const error = rpcResponse.error;
    switch (error?.statusCode) {
      case 400:
        throw new BadRequestException(error.message);
      case 404:
        throw new NotFoundException(error.message);
      // Add more cases as needed
      default:
        // If the status code does not match any case, or is not provided, throw a generic HttpException
        throw new HttpException(
          error?.message as string,
          error?.statusCode || 500
        );
    }
  }
  return rpcResponse.data as T;
}
