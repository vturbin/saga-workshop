import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';

@Schema({ collection: 'users' })
export class CustomerLoyalty {
  @Prop({ required: true, unique: true })
  public userId: string;

  @Prop({ required: true })
  public points: number;
}

export const customerLoyaltySchema =
  SchemaFactory.createForClass(CustomerLoyalty);

export const CustomerLoyaltyModel = mongoose.model(
  'users',
  customerLoyaltySchema
);
