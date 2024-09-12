import mongoose, { Mongoose } from 'mongoose';
import logger from './logger';

// Extend the global object to include __mongooseCache
declare global {
  var mongoose: undefined | Mongoose;
  var __MONGO_URI__: string;
  var __mongooseCache: MongooseCache | undefined;
}

const MONGODB_URI = process.env.MONGODB_URI ?? 'http://localhost:27017';

if (!MONGODB_URI || MONGODB_URI.trim() === '') {
  throw new Error('Please define the MONGODB_URI environment variable');
}

interface MongooseCache {
  conn: Mongoose | null;
  promise: Promise<Mongoose> | null;
}

// Ensure the global cache is initialized
let cached: MongooseCache = global.__mongooseCache || {
  conn: null,
  promise: null,
};

global.__mongooseCache = cached;

async function dbConnect(): Promise<Mongoose> {
  if (cached.conn) {
    return cached.conn;
  }
  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };
    cached.promise = mongoose
      .connect(MONGODB_URI, opts)
      .then((mongoose) => {
        logger.info('dbConnect() MongoDB Connected');
        return mongoose;
      })
      .catch((error) => {
        logger.error('dbConnect() MongoDB Connection Error:', error);
        throw error;
      });
  }
  try {
    cached.conn = await cached.promise;
  } catch (error) {
    cached.promise = null; // Reset the promise cache if connection fails
    if (error instanceof Error) {
      logger.error('dbConnect() MongoDB Connection Error:', error.message);
    } else {
      logger.error('dbConnect() MongoDB Connection Error:', error);
    }
    throw error;
  }
  return cached.conn;
}

export { dbConnect };
