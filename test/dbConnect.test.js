// test/dbConnect.test.js
// tests the connection to the database
const mongoose = require('mongoose');
const logger = require('../src/lib/logger');

// this has to be set before requiring dbConnect
process.env.MONGODB_URI = globalThis.__MONGO_URI__;
// now dbConnect can see the environment variable
const { dbConnect } = require('../src/lib/dbConnect.js');

jest.mock('mongoose');

describe('Connect to Database', () => {
  test('should return a connection object', async () => {
    // Mock mongoose.connect to return a resolved promise
    mongoose.connect.mockResolvedValue({});
    const result = await dbConnect();
    expect(result).toEqual({});
  });
  test('should throw an error', async () => {
    // Mock mongoose.connect to return a rejected promise
    mongoose.connect.mockRejectedValue(
      new Error('Could not connect to database')
    );
    try {
      await dbConnect();
    } catch (e) {
      expect(e.message).toBe('Could not connect to database');
    }
  });
  test('should throw an error if MONGODB_URI is not defined/valid', () => {
    process.env.MONGODB_URI = '';

    let dbConnect;
    let error;
    // jest.isolateModules to ensure that the dbConnect module is imported fresh
    //for each test, after you've set the MONGODB_URI environment variable.
    jest.isolateModules(async () => {
      mongoose.connect.mockResolvedValue({});
      try {
        dbConnect = require('../src/lib/dbConnect.js');
        await dbConnect();
      } catch (e) {
        error = e;
      }
    });
    expect(error).toBeDefined();
    expect(error.message).toBe(
      'Please define the MONGODB_URI environment variable'
    );
  });
});
