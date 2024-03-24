import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';

@Schema({ collection: 'stock' })
export class StockSchema {
  @Prop({ required: true, unique: true })
  public itemId: string;

  @Prop({ required: true })
  public currentStock: number;

  @Prop({ default: 0 })
  public reservedAmount: number;

  @Prop()
  public price: number;
}

export const stockSchema = SchemaFactory.createForClass(StockSchema);

export const StockModel = mongoose.model('stock', stockSchema);
