export const orderExchange = 'exchange.orders';
export const orderQueue = 'orders-queue';

export enum OrderRoutingKey {
  CheckItemsAvailability = 'orders.checkItemsAvailability',
  ReserveItems = 'orders.reserveItems',
  CancelItemsReservation = 'orders.cancelItemsReservation',
  ProcessPayment = 'orders.processPayment',
  RefundPayment = 'orders.refundPayment',
  PackageItems = 'orders.packageItems',
  AwardPoints = 'orders.awardPoints',
}
