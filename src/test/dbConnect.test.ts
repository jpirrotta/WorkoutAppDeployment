import mongoose from 'mongoose';
import { dbConnect } from '@/lib/dbConnect';
import logger from '@/lib/logger';

jest.mock('mongoose', () => ({
  connect: jest.fn(),
}));

describe('dbConnect', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    process.env.MONGODB_URI = globalThis.__MONGO_URI__;
  });

  test('should return a connection object', async () => {
    // Mock mongoose.connect to return a resolved promise
    (mongoose.connect as jest.Mock).mockResolvedValue({} as mongoose.Mongoose);
    const result = await dbConnect();
    expect(result).toEqual({});
  });

  test('should throw an error', async () => {
    // Mock mongoose.connect to return a rejected promise
    (mongoose.connect as jest.Mock).mockRejectedValue(
      new Error('Could not connect to database')
    );
    try {
      await dbConnect();
    } catch (error) {
      logger.error('Test: should throw an error - Error:', error);
      if (error instanceof Error) {
        expect(error.message).toBe('Could not connect to database');
      } else {
        throw new Error('Unexpected error type');
      }
    }
  });

  test('should throw an error if MONGODB_URI is not defined/valid', async () => {
    process.env.MONGODB_URI = '';

    let error: Error | undefined;
    // jest.isolateModules to ensure that the dbConnect module is imported fresh
    // for each test, after you've set the MONGODB_URI environment variable.
    jest.isolateModules(async () => {
      (mongoose.connect as jest.Mock).mockResolvedValue(
        {} as mongoose.Mongoose
      );
      try {
        const { dbConnect } = require('@/lib/dbConnect');
        await dbConnect();
      } catch (e) {
        error = e as Error;
      }
    });
    if (error) {
      logger.error(
        'Test: should throw an error if MONGODB_URI is not defined/valid - Error:',
        error
      );
    }
    expect(error).toBeDefined();
    expect(error!.message).toBe(
      'Please define the MONGODB_URI environment variable'
    );
  });
});
