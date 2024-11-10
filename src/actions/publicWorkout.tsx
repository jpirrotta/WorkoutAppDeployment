'use server';

// src/actions/publicWorkout.tsx
import { dbConnect } from '@/lib/dbConnect';
import UserModel from '@/models/userSchema';
import { UserDocument } from '@/models/userSchema';
import logger from '@/lib/logger';
import { BaseWorkout } from '@/types';

/**
 * Adds like to publicWorkout data.
 *
 * @async
 * @param {string} userId - The request data containing userId and workoutId.
 * @param {string} workoutId - The request data containing userId and workoutId.
 * @returns {boolean} - Returns a boolean value.
 * @throws {Error} - Throws an error if the workout data cannot be updated or created.
 */
export async function addLikePublicWorkout(
  userId: string,
  workoutId: string
): Promise<boolean> {
  try {
    logger.info('addLikePublicWorkout server action called');
    await dbConnect();

    // find who liked the workout
    const user = await UserModel.findOne({ userId });

    // If the user is not found return an error
    if (!user) {
      logger.error(`User who liked the workout not found ${userId}`);
      throw new Error(
        'we could not find your profile, please try again or contact support'
      );
    } else {
      logger.info(`User ${userId} found`);
    }

    // find the owner of the workout
    let workoutOwner: UserDocument | null = await UserModel.findOne({
      workouts: { $elemMatch: { _id: workoutId } },
    });

    // If the workoutOwner is not found return an error
    if (!workoutOwner) {
      logger.error(`Workout owner not found`);
      throw new Error(
        'we could not find the user who owns this workout, please try again later'
      );
    } else {
      logger.info(`Workout owner ${workoutOwner.name} found`);
      const result = await UserModel.updateOne(
        {
          userId: workoutOwner.userId,
          workouts: { $elemMatch: { _id: workoutId } },
        },
        {
          $addToSet: { 'workouts.$.likes': user.userId },
        }
      );
      logger.info(result);
      return true;
    }
  } catch (error) {
    logger.error(`Error: ${error}`);
    throw new Error('Internal server error');
  }
}

export async function removeLikePublicWorkout(
  userId: string,
  workoutId: string
): Promise<boolean> {
  try {
    logger.info('removeLikePublicWorkout server action called');
    await dbConnect();

    // find who unliked the workout
    const user = await UserModel.findOne({ userId: userId });

    // If the user is not found return an error
    if (!user) {
      logger.error('User who unliked the workout not found');
      throw new Error(
        'we could not find your profile, please try again or contact support'
      );
    } else {
      logger.info(`User ${userId} found`);
    }

    // find the owner of the workout
    let workoutOwner: UserDocument | null = await UserModel.findOne({
      workouts: { $elemMatch: { _id: workoutId } },
    });

    // If the workoutOwner is not found return an error
    if (!workoutOwner) {
      logger.error(`Workout owner not found`);
      throw new Error(
        'we could not find the user who owns this workout, please try again later'
      );
    } else {
      logger.info(`Workout owner ${workoutOwner.name} found`);
      const result = await UserModel.updateOne(
        {
          userId: workoutOwner.userId,
          workouts: { $elemMatch: { _id: workoutId } },
        },
        {
          $pull: { 'workouts.$.likes': user.userId },
        }
      );
      logger.info(result);
      return true;
    }
  } catch (error) {
    logger.error(`Error: ${error}`);
    throw new Error('Internal server error');
  }
}

export async function addCommentPublicWorkout(
  userId: string,
  workoutId: string,
  commentText: string
): Promise<boolean> {
  try {
    if (!commentText || commentText === undefined || commentText == '') {
      return false;
    }
    logger.info('addCommentPublicWorkout server action called');
    await dbConnect();

    // find who is commented on the workout
    const user = await UserModel.findOne({ userId: userId });

    // If the user is not found return an error
    if (!user) {
      logger.error('User who commented on the workout not found');
      throw new Error(
        'we could not find your profile, please try again or contact support'
      );
    } else {
      logger.info(`User ${userId} found`);
    }

    // find the owner of the workout
    let workoutOwner: UserDocument | null = await UserModel.findOne({
      workouts: { $elemMatch: { _id: workoutId } },
    });

    // If the workoutOwner is not found return an error
    if (!workoutOwner) {
      logger.error(`Workout owner not found`);
      throw new Error(
        'we could not find the user who owns this workout, please try again later'
      );
    } else {
      logger.info(`Workout owner ${workoutOwner.name} found`);
      const result = await UserModel.updateOne(
        {
          userId: workoutOwner.userId,
          workouts: { $elemMatch: { _id: workoutId } },
        },
        {
          $addToSet: {
            'workouts.$.comments': { text: commentText, userId: user.userId },
          },
        }
      );
      logger.info(result);
      return true;
    }
  } catch (error) {
    logger.error(`Error: ${error}`);
    throw new Error('Internal server error');
  }
}

export async function removeCommentPublicWorkout(
  workoutId: string,
  commentId: string,
): Promise<boolean> {
  try {
    if (!commentId || commentId === undefined || commentId == '') {
      return false;
    }
    logger.info('removeCommentPublicWorkout server action called');
    await dbConnect();

    // find the owner of the workout
    let workoutOwner: UserDocument | null = await UserModel.findOne({
      workouts: { $elemMatch: { _id: workoutId } },
    });

    // If the workoutOwner is not found return an error
    if (!workoutOwner) {
      logger.error(`Workout owner not found`);
      throw new Error(
        'we could not find the user who owns this workout, please try again later'
      );
    } else {
      logger.info(`Workout owner ${workoutOwner.name} found`);
      const result = await UserModel.updateOne(
        {
          userId: workoutOwner.userId,
          workouts: { $elemMatch: { _id: workoutId } },
        },
        {
          $pull: {
            'workouts.$.comments': { _id: commentId },
          },
        }
      );
      logger.info(result);
      return true;
    }
  } catch (error) {
    logger.error(`Error: ${error}`);
    throw new Error('Internal server error');
  }
}

export async function addSavePublicWorkout(
  userId: string,
  workoutToBeSaved: BaseWorkout
): Promise<boolean | Error> {
  try {
    logger.info('addSavePublicWorkout server action called');
    await dbConnect();

    // Find who saved the workout
    let user = await UserModel.findOne({ userId: userId });
    if (!user) {
      logger.error('User who saved the workout not found');
      throw new Error('current user not found');
    } else {
      logger.info(`User ${user.name} found`);
    }


    // Find the owner of the workout
    let workoutOwner: UserDocument | null = await UserModel.findOne({
      workouts: { $elemMatch: { _id: workoutToBeSaved } },
    });
    if (!workoutOwner) {
      logger.error(`Workout owner not found`);
      throw new Error('workout owner not found');
    } else {
      logger.info(`Workout owner ${workoutOwner.name} found`);
    }

    
    // Reset social feed data before saving as a "fresh" workout to user's workout library (also add previous owner's name to title)
    workoutToBeSaved.name = `${workoutOwner.name} - ${workoutToBeSaved.name}`;
    workoutToBeSaved.public = false;
    workoutToBeSaved.likes = [];
    workoutToBeSaved.comments = [];
    workoutToBeSaved.saves = [];


    // Add workout to user's workouts list (only if it does not already exist there)
    const userResult = await UserModel.updateOne(
      {
        userId: user.userId,
      },
      {
        $addToSet: { workouts: workoutToBeSaved },
      }
    );
    if (userResult.modifiedCount > 0) {
      logger.info('Workout successfully added to user workout library');
    } else {
      logger.info('User has already has a copy of this workout in their library');
      return false;
    }


    // Add userId to workout's saves list if they have not saved it before
    const workoutResult = await UserModel.updateOne(
      {
        userId: workoutOwner.userId,
        workouts: { $elemMatch: { _id: workoutToBeSaved._id } },
      },
      {
        $addToSet: { 'workouts.$.saves': user.userId },
      }
    );
    if (workoutResult.modifiedCount > 0) {
      logger.info("User's ID successfully added to workout's saves list");
    } else {
      logger.info("User has already saved this workout. Their ID has not be added to the workout's saves list");
    }
    return true;
  } catch (error) {
    logger.error(`Error: ${error}`);
    return Error(`${error}`);
  }
}

export async function removeSavePublicWorkout(
  userId: string,
  workoutId: string
): Promise<boolean> {
  try {
    logger.info('removeSavePublicWorkout server action called');
    await dbConnect();

    // find who is unsaving the workout
    let user = await UserModel.findOne({ userId: userId });

    // If the user is not found return an error
    if (!user) {
      logger.error('User who unsaved the workout not found');
      throw new Error(
        'we could not find your profile, please try again or contact support'
      );
    } else {
      logger.info(`User ${user.name} found`);
    }

    // find the owner of the workout
    let workoutOwner: UserDocument | null = await UserModel.findOne({
      workouts: { $elemMatch: { _id: workoutId } },
    });

    // If the workoutOwner is not found return an error
    if (!workoutOwner) {
      logger.error(`Workout owner not found`);
      throw new Error(
        'we could not find the user who owns this workout, please try again later'
      );
    } else {
      logger.info(`Workout owner ${workoutOwner.name} found`);
    }

    // Remove userId from workout's saves list
    const workoutResult = await UserModel.updateOne(
      {
        userId: workoutOwner.userId,
        workouts: { $elemMatch: { _id: workoutId } },
      },
      {
        $pull: { 'workouts.$.saves': user.userId },
      }
    );
    logger.info(workoutResult);

    // Remove workoutId from user's savedWorkouts list
    const userResult = await UserModel.updateOne(
      {
        userId: user.userId,
      },
      {
        $pull: { savedWorkouts: workoutId },
      }
    );
    logger.info(userResult);

    return true;
  } catch (error) {
    logger.error(`Error: ${error}`);
    throw new Error('Internal server error');
  }
}
