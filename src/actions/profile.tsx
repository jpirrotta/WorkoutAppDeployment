'use server';

// src/actions/profile.tsx
import { dbConnect } from '@/lib/dbConnect';
import UserModel from '@/models/userSchema';
import { User } from '@/types';
import logger from '@/lib/logger';

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
