// src/dbConnect.js
// code to connect to mongoDB database
const mongoose = require('mongoose'); 
const logger = require('./logger');

global.mongoose = global.mongoose || { conn: null, promise: null };

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI || MONGODB_URI.trim() === '') {
  throw new Error('Please define the MONGODB_URI environment variable');
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

module.exports.dbConnect = async function () {
  try {
    if (cached.conn) {
      return cached.conn;
    }
    if (!cached.promise) {
      const opts = {
        bufferCommands: false,
      };
      cached.promise = await mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
        logger.info('dbConnect() MongoDB Connected');
        return mongoose;
      });
    }
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }
  return cached.conn;
};
