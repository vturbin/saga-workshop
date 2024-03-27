import { InternalServerErrorException, Logger } from '@nestjs/common';

export function handleRpcError(errorResponse: unknown): void {
  Logger.error(errorResponse);
  throw new InternalServerErrorException('Failed to receive response');
}
