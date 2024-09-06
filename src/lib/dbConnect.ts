// src/dbConnect.ts
// Code to connect to MongoDB database
import mongoose, { Mongoose } from 'mongoose';
import logger from './logger';

const MONGODB_URI = process.env.MONGODB_URI ?? "http://localhost:27017";

if (!MONGODB_URI || MONGODB_URI.trim() === '') {
  throw new Error('Please define the MONGODB_URI environment variable');
}

interface MongooseCache {
  conn: Mongoose | null;
  promise: Promise<Mongoose> | null;
}

// Extend the global object to include __mongooseCache
declare global {
  var __mongooseCache: MongooseCache | undefined;
}

// Ensure the global cache is initialized
let cached: MongooseCache = global.__mongooseCache || {
  conn: null,
  promise: null,
};

global.__mongooseCache = cached;

export async function dbConnect(): Promise<Mongoose> {
  if (cached.conn) {
    return cached.conn;
  }
  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };
    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      logger.info('dbConnect() MongoDB Connected');
      return mongoose;
    });
  }
  cached.conn = await cached.promise;
  return cached.conn;
}
