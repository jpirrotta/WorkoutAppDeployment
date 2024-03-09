// pages/api/profile.js
import { dbConnect } from '@/lib/dbConnect';
import User from '@/models/userSchema';
import logger from '@/lib/logger';

export async function POST(req, res) {
  logger.info('\n\nPOST Profile API called');
  try {
    // Get the request data
    const data = await req.json();
    const { userId, name, profile } = data;
    //

    // logs
    logger.info(`Request data: ${JSON.stringify(data)}`);
    logger.info(`userId: ${userId}`);
    logger.info(`name: ${name}`);
    //

    // Connect to the database
    await dbConnect();

    // Find the user by their userId
    let user = await User.findOne({ userId: userId });
    if (!user) {
      // If the user is not found, create a new user
      logger.info('User not found, creating new user');
      user = new User({ userId: userId, name: name, profile: profile });
    } else {
      // If the user is found, update their profile
      logger.info('User found, updating profile');
      // only update the non-empty fields
      for (const key in profile) {
        if (profile[key]) {
          user.profile[key] = profile[key];
        }
      }
    }

    // add the weight to the weight history and 
    // the body fat to the body fat history
    if (profile.weight) {
      user.weightHistory.push({ value: profile.weight });
    }
    if (profile.bodyFat) {
      user.bodyFatHistory.push({ value: profile.bodyFat });
    }
    // 
    
    logger.info(`User being saved`);
    // Save the user (either updated or new)
    await user.save();
    logger.info(`User saved: ${user}`);

    // send the response
    return new Response(JSON.stringify(user), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    logger.error(`POST Error updating profile: ${error}`);
    return new Response(error.message, { status: 500 });
  }
}

export async function GET(req, res) {
  logger.info('\n\nGET Profile API called');
  try {
    const { searchParams } = new URL(req.url);
    // Get the userId from the query parameters
    const userId = searchParams.get('userId');
    logger.info(`GET Request userId: ${userId}`);
    await dbConnect();
    const user = await User.findOne({ userId: userId });
    if (!user) {
      logger.info('GET User not found / has not saved data yet');
      return new Response('User not found / has not saved data yet', { status: 404 });
    } else {
      logger.info(`GET User found`);
      return new Response(JSON.stringify(user), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }
  } catch (error) {
    logger.error(`GET Error getting profile: ${error}`);
    return new Response(error.message, { status: 500 });
  }
}