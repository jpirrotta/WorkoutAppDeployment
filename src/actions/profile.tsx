'use server';

import { dbConnect } from '@/lib/dbConnect';
import UserModel from '@/models/userSchema';
import { User } from '@/types';
import logger from '@/lib/logger';

function cleanObject(obj: any): any {
  delete obj?._id;
  delete obj?.__v;
  return obj;
}

export async function getUserData(
  userId: string,
): Promise<User> {
  logger.info('getProfile server action called');
  try {
    logger.debug(`userId: ${userId}`);
    await dbConnect();
    const user = await UserModel.findOne({
      userId: userId,
    }).lean();

    if (!user) {
      logger.info('GET User not found / has not saved data yet');
      throw new Error(
        'Unable to find user data. Please ensure your profile is complete.'
      );
    }
    logger.info(`GET User found`);
    /* Ideally because the use on lean we will only need return the user object as
      is converts it to a plain object. 
      Currently this function is buggy with nested documents/arrays/objects
      see https://github.com/Automattic/mongoose/issues/13772
      thats why i use this workaround */
    cleanObject(user); // remove _id and __v this is temporary until the lean bug is fixed
    return JSON.parse(JSON.stringify(user)); // Serialize the user data workaround
  } catch (error) {
    if (error instanceof Error && error.message === 'Request aborted') {
      logger.info('Request aborted');
      throw new Error('Request aborted');
    }
    if (error instanceof Error) {
      logger.error(`GET Error getting profile: ${error.message}`);
      throw new Error(error.message);
    }
    logger.error(`Internal server error, GET Error getting profile: ${error}`);
    throw new Error(
      'Something went wrong on our end. Please try again later or contact support if the issue persists.'
    );
  }
}
