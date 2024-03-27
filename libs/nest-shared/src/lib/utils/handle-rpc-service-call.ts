import { HttpException } from '@nestjs/common';
import { RpcResponse } from '../interfaces/rpc-response.interface';

export async function handleRPCServiceCall<T>(
  serviceMethod: Promise<T>
): Promise<RpcResponse<T>> {
  try {
    const response = await serviceMethod;
    return { data: response, success: true } satisfies RpcResponse<T>;
  } catch (error) {
    const errorException = error as HttpException;
    return {
      error: {
        statusCode: errorException.getStatus(),
        message: errorException.getResponse() as string,
      },
      success: false,
    } satisfies RpcResponse<T>;
  }
}
