export * from './lib/nest-shared.module';

export * from './lib/clients/loyalty.client';
export * from './lib/clients/warehouse.client';
export * from './lib/clients/payment.client';

export * from './lib/loyalty/assign-loyalty-points.dto';
export * from './lib/db/interfaces/generic-repository.abstract';
export * from './lib/db/repositories/mongo-generic.repository';
export * from './lib/db/mongoose-session';
export * from './lib/db/unit-of-work';
export * from './lib/payment/enums/payment-method.enum';
export * from './lib/order/billing-address.dto';
export * from './lib/order/order-item.dto';
export * from './lib/order/payment-details.dto';
export * from './lib/payment/payment-id.dto';
export * from './lib/payment/process-payment.dto';
export * from './lib/payment/refund-payment.dto';
export * from './lib/order/place-order.dto';
export * from './lib/order/shipping-address.dto';
export * from './lib/warehouse/items-request.dto';
export * from './lib/warehouse/check-items-availability-response.dto';
export * from './lib/warehouse/package-items-request.dto';
export * from './lib/warehouse/reserve-items-response.dto';

export * from './lib/constants/rmq.constants';

export * from './lib/utils/handle-rpc-error';
export * from './lib/utils/handle-rpc-service-call';
export * from './lib/utils/handle-rpc-response';

export * from './lib/interfaces/rpc-response.interface';
