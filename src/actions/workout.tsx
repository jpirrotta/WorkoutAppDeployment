'use server';

import { dbConnect } from '@/lib/dbConnect';
import User from '@/models/userSchema';
import logger from '@/lib/logger';
import { NewWorkout, patchReqDataType, Workout, Sets, Exercise } from '@/types';

async function addWorkout(
  userId: string,
  workout: NewWorkout
): Promise<{ title: string; message: string; createdWorkout?: Workout }> {
  logger.info('POST Workout action called');

  try {
    await dbConnect();

    const result = await User.findOneAndUpdate(
      { userId },
      {
        $push: {
          workouts: workout,
        },
      },
      {
        new: true,
        projection: {
          workouts: {
            $slice: -1,
          },
          userId: 1,
        },
      }
    );

    if (!result?.userId) {
      logger.error('User not found!');
      return {
        title: 'User not found.',
        message: 'User you are trying to add Workout for does not exist in DB.',
      };
    }

    if (!result.workouts || result.workouts.length === 0) {
      logger.error('Workout not found!');
      return {
        title: 'Workout not found.',
        message: 'Unable to find Workout for current User',
      };
    }

    const savedWorkout = result.workouts[0]?.toObject();
    logger.info(`Added Workout: ${JSON.stringify({ savedWorkout })}`);

    return {
      title: 'Workout Created!',
      message: `Workout "${workout.name}" created successfully!`,
      createdWorkout: savedWorkout,
    };
  } catch (error) {
    if (error instanceof Error) {
      logger.error(`Error adding workout: ${error.message}`);
      throw new Error(`Error adding Workout: ${error.message}`);
    }
    logger.error(`Error adding workout: ${error}`);
    throw new Error(`Internal Server Error: ${error}`);
  }
}

async function updateWorkout(
  userId: string,
  workoutId: string,
  workoutUpdateData: patchReqDataType
): Promise<{ title: string; message: string }> {
  logger.info('\n\nPATCH Workout action called');

  try {
    logger.info(`\n\nWorkout ID - ${workoutId}`);
    await dbConnect();

    // Build update object based on provided data
    const updateObj: {
      'workouts.$.name'?: string;
      'workouts.$.public'?: boolean;
      'workouts.$.postDate'?: Date;
      'workouts.$.comments'?: Array<{ text: string; userId: string }>;
      $push?: {
        'workouts.$.exercises': {
          $each: Exercise[];
        };
      };
    } = {};

    if (workoutUpdateData.name) {
      updateObj['workouts.$.name'] = workoutUpdateData.name;
    }

    if (workoutUpdateData.public !== undefined) {
      updateObj['workouts.$.public'] = workoutUpdateData.public;
      updateObj['workouts.$.postDate'] = workoutUpdateData.public
        ? new Date()
        : new Date(0);
    }

    if (workoutUpdateData.comments) {
      updateObj['workouts.$.comments'] = workoutUpdateData.comments;
    }

    if ((workoutUpdateData.exerciseArr ?? []).length > 0) {
      updateObj['$push'] = {
        'workouts.$.exercises': {
          $each: workoutUpdateData.exerciseArr ?? [],
        },
      };
    }

    const result = await User.findOneAndUpdate(
      {
        userId,
        'workouts._id': workoutId,
      },
      updateObj,
      {
        new: true,
      }
    );

    // Check if user exists
    if (!result) {
      logger.error('User not found!');
      return {
        title: 'Not Found',
        message: 'Unable to find specified User',
      };
    }

    // Check if workout exists in user's workouts array
    const workoutExists = result.workouts?.some(
      (workout) => workout._id?.toString() === workoutId
    );

    if (!workoutExists) {
      logger.error('Workout not found!');
      return {
        title: 'Workout not found',
        message: 'Unable to find specified Workout',
      };
    }

    logger.info('Workout updated successfully');
    return {
      title: 'Workout Updated!',
      message: 'Workout has been updated successfully!',
    };
  } catch (error) {
    if (error instanceof Error) {
      logger.error(`Error updating workout: ${error.message}`);
      throw new Error(`Error updating Workout: ${error.message}`);
    }
    logger.error(`Error updating workout: ${error}`);
    throw new Error(`Internal Server Error: ${error}`);
  }
}

async function updateExerciseSets(
  userId: string,
  workoutId: string,
  exerciseId: string,
  setData: Sets
): Promise<{ title: string; message: string }> {
  logger.info('\n\nPATCH Workout-Exercise action called');

  try {
    logger.info(`\n\nWorkout ID - ${workoutId} | Exercise ID - ${exerciseId}`);

    await dbConnect();

    // First verify the document exists with all required nested objects
    const existingUser = await User.findOne({
      userId,
      'workouts._id': workoutId,
      'workouts.exercises._id': exerciseId,
    });

    if (!existingUser) {
      logger.error('Required data not found!');
      return {
        title: 'Not found',
        message: 'Unable to find specified User, Workout or Exercise',
      };
    }

    // Perform targeted update
    const result = await User.findOneAndUpdate(
      {
        userId,
        'workouts._id': workoutId,
        'workouts.exercises._id': exerciseId,
      },
      {
        $set: {
          'workouts.$[workout].exercises.$[exercise].sets': setData,
        },
      },
      {
        arrayFilters: [
          { 'workout._id': workoutId },
          { 'exercise._id': exerciseId },
        ],
        new: true,
      }
    );

    if (!result) {
      throw new Error('Update failed');
    }

    logger.info('Exercise sets updated successfully');
    return { title: 'Success', message: 'Exercise sets updated successfully' };
  } catch (error) {
    if (error instanceof Error) {
      logger.error(`Error updating workout exercise: ${error.message}`);
      throw new Error(`Error updating workout Exercise: ${error.message}`);
    }
    logger.error(`Error updating exercise: ${error}`);
    throw new Error(`Internal Server Error: ${error}`);
  }
}

// update a workout to edit exercises, name, public status, comments
async function removeExercise(
  userId: string,
  workoutId: string,
  ExerciseId: string
): Promise<{ title: string; message: string }> {
  logger.info('\n\nPATCH Workout action called');

  try {
    logger.info(`\nExercise ID to be removed- ${ExerciseId}`);

    await dbConnect();

    // Single atomic operation to find and remove exercise
    const result = await User.findOneAndUpdate(
      {
        userId,
        'workouts._id': workoutId,
        'workouts.exercises._id': ExerciseId,
      },
      {
        $pull: {
          'workouts.$[workout].exercises': {
            _id: ExerciseId,
          },
        },
      },
      {
        arrayFilters: [{ 'workout._id': workoutId }],
        new: true,
      }
    );

    if (!result) {
      logger.error('Required data not found!');
      return {
        title: 'Not found',
        message: 'Unable to find specified User, Workout or Exercise',
      };
    }

    logger.info('Exercise removed successfully');
    return {
      title: 'Success',
      message: 'Exercise removed successfully from the Workout',
    };
  } catch (error) {
    if (error instanceof Error) {
      logger.error(`Error removing exercise: ${error.message}`);
      throw new Error(`Error removing Workout: ${error.message}`);
    }
    logger.error(`Error removing workouts: ${error}`);
    throw new Error(`Internal Server Error: ${error}`);
  }
}

async function deleteWorkout(
  userId: string,
  workoutId: string
): Promise<{ title: string; message: string }> {
  logger.info('DELETE Workout action called');

  try {
    await dbConnect();

    const result = await User.findOneAndUpdate(
      {
        userId,
        'workouts._id': workoutId,
      },
      {
        $pull: {
          workouts: {
            _id: workoutId,
          },
        },
      }
    );

    if (!result) {
      logger.error('User or Workout not found!');
      return {
        title: 'Not found',
        message: 'Unable to find specified User or Workout',
      };
    }

    logger.info(`Workout deleted: ${workoutId}`);

    return {
      title: 'Workout Deleted!',
      message: 'The selected Workout has been deleted successfully!',
    };
  } catch (error) {
    if (error instanceof Error) {
      logger.error(`Error deleting workout: ${error.message}`);
      throw new Error(`Error deleting Workout: ${error.message}`);
    }
    logger.error(`Error deleting workout: ${error}`);
    throw new Error(`Internal Server Error: ${error}`);
  }
}
// unused as of now since we don't have any feature for deleting all workouts at once, but might going ahead
// delete all workouts for a user
async function deleteAllWorkouts(
  userId: string
): Promise<{ title: string; message: string }> {
  logger.info('\n\nDELETE All Workouts action called');

  try {
    logger.info(`Request from userId: ${userId}`);
    await dbConnect();

    // Single atomic operation to find user and update workouts array
    const result = await User.findOneAndUpdate(
      { userId },
      { $set: { workouts: [] } },
      { new: true }
    );

    if (!result) {
      logger.error('User not found!');
      return {
        title: 'User not found.',
        message:
          'User you are trying to delete Workouts for does not exist in DB.',
      };
    }

    if (result.workouts?.length === 0) {
      logger.info('No workouts found to delete');
      return {
        title: 'No Workouts found',
        message: 'Seems like you have no Workouts to delete',
      };
    }

    logger.info('All workouts deleted successfully');
    return {
      title: 'Success',
      message: 'All workouts deleted successfully',
    };
  } catch (error) {
    if (error instanceof Error) {
      logger.error(`Error deleting workouts: ${error.message}`);
      throw new Error(`Error deleting Workouts: ${error.message}`);
    }
    logger.error(`Error deleting workouts: ${error}`);
    throw new Error(`Internal Server Error: ${error}`);
  }
}

export {
  addWorkout,
  deleteWorkout,
  deleteAllWorkouts,
  updateWorkout,
  removeExercise,
  updateExerciseSets,
};
