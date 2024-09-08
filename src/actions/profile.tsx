'use server';

// src/actions/profile.tsx
import { dbConnect } from '@/lib/dbConnect';
import UserModel from '@/models/userSchema';
import { User } from '@/types';
import logger from '@/lib/logger';

//? if used elsewhere, this function should be moved to utils folder
/**
 * Cleans the user object by removing sensitive fields.
 *
 * @param {any} obj - The user object to clean.
 * @returns {any} - The cleaned user object.
 */
function cleanObject(obj: any): any {
  delete obj?._id;
  delete obj?.__v;
  return obj;
}

/**
 * Fetches user data from the database.
 *
 * @param {string} userId - The ID of the user to fetch data for.
 * @returns {Promise<User>} - A promise that resolves to the user data.
 * @throws {Error} - Throws an error if the user data cannot be fetched.
 */
export async function getUserData(userId: string): Promise<User | null> {
  logger.info('getProfile server action called');
  try {
    logger.debug(`userId: ${userId}`);
    await dbConnect();
    const user = await UserModel.findOne({ userId: userId })
      .select(
        'userId name profile.age profile.gender profile.weight profile.height profile.bodyFat'
      )
      .lean();

    if (!user) {
      logger.info('GET User not found / has not saved data yet');
      // ? see profile form re-render issues
      return null;
    } else {
      logger.info(`GET User found: ${JSON.stringify(user)}`);
      /* Ideally because the use on lean we will only need return the user object as
        is converts it to a plain object. 
        Currently this function is buggy with nested documents/arrays/objects
        see https://github.com/Automattic/mongoose/issues/13772
        thats why i use this workaround */
      cleanObject(user); // remove _id and __v this is temporary until the lean bug is fixed
      return JSON.parse(JSON.stringify(user)); // Serialize the user data workaround
    }
  } catch (error) {
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

/**
 * Updates or creates user profile data.
 *
 * @async
 * @param {User} data - The request data containing userId, name, and profile.
 * @returns {Promise<{title: string; message: string}>} - A promise that resolves to a response object containing a title and message.
 * @throws {Error} - Throws an error if the profile data cannot be updated or created.
 */
export async function updateUserProfile(
  data: User
): Promise<{ title: string; message: string }> {
  logger.info('updateUserProfile server action called');
  try {
    const { userId, name, profile } = data;

    // logs
    logger.info(`Request data: ${JSON.stringify(data)}`);
    logger.info(`userId: ${userId}`);
    logger.info(`name: ${name}`);
    logger.info(`profile: ${JSON.stringify(profile)}`);
    //

    // Connect to the database
    await dbConnect();

    // Find the user by their userId
    let user = await UserModel.findOne({ userId: userId });
    if (!user) {
      // If the user is not found, create a new user
      logger.info('User not found, creating new user');
      user = new UserModel({ userId, name, profile });
    } else {
      // If the user is found, update their profile
      logger.info('User found, updating profile');
      // only update the non-empty fields
      if (profile && user.profile) {
        if (profile.age) {
          user.profile.age = profile.age;
        }
        if (profile.bodyFat) {
          user.profile.bodyFat = profile.bodyFat;
        }
        if (profile.gender) {
          user.profile.gender = profile.gender;
        }
        if (profile.height) {
          user.profile.height = profile.height;
        }
      }
    }

    // add the weight to the weight history and
    // the body fat to the body fat history
    if (profile?.weight) {
      user.weightHistory?.push({ value: profile.weight, date: new Date() });
    }
    if (profile?.bodyFat) {
      user.bodyFatHistory?.push({ value: profile.bodyFat, date: new Date() });
    }
    //

    logger.info(`User being saved`);
    // Save the user (either updated or new)
    await user.save();
    logger.info(`User saved: ${JSON.stringify(user)}`);

    // send the response
    return {
      title: 'Good news!',
      message: 'Your Profile updated successfully',
    };
  } catch (error) {
    if (error instanceof Error) {
      logger.error(`Error updating profile: ${error.message}`);
      throw new Error(`Failed to update profile: ${error.message}`);
    }
    logger.error(`Error updating profile: ${error}`);
    throw new Error('Internal server error');
  }
}

/**
 * Deletes a user profile from the database.
 *
 * @async
 * @param {string} userId - The ID of the user to delete.
 * @returns {Promise<{title: string; message: string}>} - A promise that resolves to a response object containing a title and message.
 * @throws {Error} - Throws an error if the user profile cannot be deleted.
 */
export async function deleteUserProfile(
  userId: string
): Promise<{ title: string; message: string }> {
  logger.info('deleteUserProfile server action called');
  try {
    logger.info(`DELETE user: ${userId}`);
    await dbConnect();
    const user = await UserModel.findOne({ userId: userId });

    if (!user) {
      logger.info('DELETE User not found');
      throw new Error(
        'we could not find your profile, please try again or contact support'
      );
    } else {
      logger.info('DELETE User found');
      await user.deleteOne();
      logger.info('DELETE User deleted');
      return {
        title: 'Profile deleted',
        message: 'Your profile data has been deleted successfully!',
      };
    }
  } catch (error) {
    if (error instanceof Error) {
      logger.error(`DELETE Error deleting profile: ${error.message}`);
      throw new Error(`Failed to delete profile: ${error.message}`);
    }
    logger.error(`DELETE Error deleting profile: ${error}`);
    throw new Error('Internal server error');
  }
}
