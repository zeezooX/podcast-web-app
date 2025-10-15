import mongoose from 'mongoose';
import { MongoClient, GridFSBucket } from 'mongodb';

let gridFSBucket: GridFSBucket;
let mongoClient: MongoClient;

export const connectDB = async (): Promise<void> => {
  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/podcast-app';

    // Connect with Mongoose
    await mongoose.connect(mongoURI);
    console.log('MongoDB connected successfully');

    // Create separate MongoDB client for GridFS
    mongoClient = new MongoClient(mongoURI);
    await mongoClient.connect();

    // Initialize GridFS bucket
    const db = mongoClient.db();
    gridFSBucket = new GridFSBucket(db, {
      bucketName: 'uploads',
    });

    console.log('GridFS initialized successfully');

    mongoose.connection.on('error', (err) => {
      console.error('MongoDB connection error:', err);
    });

    mongoose.connection.on('disconnected', () => {
      console.warn('MongoDB disconnected');
    });
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

export const getGridFSBucket = (): GridFSBucket => {
  if (!gridFSBucket) {
    throw new Error('GridFS bucket not initialized. Call connectDB first.');
  }
  return gridFSBucket;
};

export const closeDB = async (): Promise<void> => {
  if (mongoClient) {
    await mongoClient.close();
  }
  if (mongoose.connection.readyState === 1) {
    await mongoose.disconnect();
  }
};
