export interface RpcResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    statusCode: number;
    message: string;
  };
}
