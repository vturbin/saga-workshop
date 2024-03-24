import mongoose from 'mongoose';
import { DATABASE_CONFIGURATION } from '../app.module';

import { StockModel, StockSchema } from '../models/stock.schema';

export async function seedDatabase() {
  await mongoose.connect(DATABASE_CONFIGURATION.mongoConnectionString);

  // Check if the data already exists
  const existingData = await StockModel.find(); // Adjust this condition based on your needs
  if (!existingData.length) {
    console.log('Seeding database...');

    // List of data to seed
    const dataToSeed: StockSchema[] = [
      {
        itemId: '1',
        reservedAmount: 0,
        price: 24.99,
        currentStock: 100,
      },
      {
        itemId: '2',
        reservedAmount: 0,
        price: 11.49,
        currentStock: 90,
      },
      {
        itemId: '3',
        reservedAmount: 0,
        price: 13.9,
        currentStock: 80,
      },
      {
        itemId: '4',
        reservedAmount: 0,
        price: 55.5,
        currentStock: 70,
      },
      {
        itemId: '5',
        reservedAmount: 0,
        price: 21.99,
        currentStock: 60,
      },
      {
        itemId: '6',
        reservedAmount: 0,
        price: 123.99,
        currentStock: 50,
      },
    ];

    // Insert data into your collection
    await StockModel.insertMany(dataToSeed);

    console.log('Database seeded successfully.');
  } else {
    console.log('Database already seeded.');
  }

  await mongoose.disconnect();
}
