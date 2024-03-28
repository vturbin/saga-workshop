export const orderExchange = 'exchange.orders';

export const checkItemsQueue = 'warehouse-check-items-queue';
export const checkItemsResponseQueue = 'warehouse-check-items-response-queue';
export const reserveItemsQueue = 'warehouse-reserve-items-queue';
export const reserveItemsResponseQueue =
  'warehouse-reserve-items-response-queue';
export const cancelItemsReservationQueue = 'warehouse-cancel-items-queue';
export const cancelItemsReservationResponseQueue =
  'warehouse-cancel-items-response-queue';
export const packageItemsQueue = 'warehouse-package-items-queue';
export const packageItemsResponseQueue =
  'warehouse-package-items-response-queue';
export const processPaymentQueue = 'payment-process-payment-queue';
export const processPaymentResponseQueue =
  'payment-process-payment-response-queue';
export const refundPaymentQueue = 'payment-refund-payment-queue';
export const refundPaymentResponseQueue =
  'payment-refund-payment-response-queue';
export const awardPointsQueue = 'loyalty-award-points-queue';
export const awardPointsResponseQueue = 'loyalty-award-points-response-queue';

export enum OrderRoutingKey {
  CheckItemsAvailability = 'orders.checkItemsAvailability',
  CheckItemsAvailabilityResponse = 'orders.checkItemsAvailabilityResponse',
  ReserveItems = 'orders.reserveItems',
  ReserveItemsResponse = 'orders.reserveItemsResponse',
  CancelItemsReservation = 'orders.cancelItemsReservation',
  CancelItemsReservationResponse = 'orders.cancelItemsReservationResponse',
  ProcessPayment = 'orders.processPayment',
  ProcessPaymentResponse = 'orders.processPaymentResponse',
  RefundPayment = 'orders.refundPayment',
  RefundPaymentResponse = 'orders.refundPaymentResponse',
  PackageItems = 'orders.packageItems',
  PackageItemsResponse = 'orders.packageItemsResponse',
  AwardPoints = 'orders.awardPoints',
  AwardPointsResponse = 'orders.awardPointsResponse',
}
