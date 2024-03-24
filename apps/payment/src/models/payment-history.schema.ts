import { PaymentMethod } from '@nest-shared';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { PaymentStatus } from '../enums/payment-status.enum';

@Schema({ collection: 'paymentHistory' })
export class PaymentHistorySchema {
  @Prop()
  public paymentId: string;

  @Prop({ type: String, enum: Object.values(PaymentStatus) })
  public paymentStatus: PaymentStatus;

  @Prop({ type: String, enum: Object.values(PaymentMethod) })
  public paymentMethod: PaymentMethod;

  @Prop()
  public email?: string;

  @Prop()
  public amount: number;

  @Prop()
  public date: Date;
}

export const paymentHistorySchema =
  SchemaFactory.createForClass(PaymentHistorySchema);
