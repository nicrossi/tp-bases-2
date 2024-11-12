import mongoose from 'mongoose';

const MONGO_PORT = 27017
const MONGO_DB_NAME = process.env.MONGO_DB_NAME || 'expensesTracking_db'
const MONGO_URL = `mongodb://localhost:${MONGO_PORT}/${MONGO_DB_NAME}`;

export async function connectToMongoDB() {
  try {
    await mongoose.connect(MONGO_URL);
    console.log("Connected to MongoDB:", MONGO_URL);
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
  }
}