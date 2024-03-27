// src/app/api/workout/save/route.js

// responsible for saving a workout from the social feed


import { dbConnect } from '@/lib/dbConnect';
import User from '@/models/userSchema';
import logger from '@/lib/logger';
//! TODO CONTINUE HERE ONCE THE UI IS READY
export async function POST(req, res) {
  logger.info('\n\nPOST Save Workout from feed API called');
  try {
    // Get the request data
    const data = await req.json();
    const { userId, workoutId } = data;
    //

    // logs
    logger.info(`Request data: ${JSON.stringify(data)}`);
    logger.info(`userId: ${userId}`);
    logger.info(`workoutId: ${workoutId}`);
    //

    // Connect to the database
    await dbConnect();

    // Find the user by their userId
    let user = await User.findOne({ userId: userId });

    // If the user is not found return an error
    if (!user) {
      logger.error('User not found');
      return new Response('User not found', { status: 404 });
    }

    // if the user is found save the workout
    logger.info('User found, saving workout');

    // check if the workout is already saved
    const savedWorkoutIndex = user.savedWorkouts.findIndex(
      (workout) => workout.workoutId === workoutId
    );

    if (savedWorkoutIndex === -1) {
      // if the workout is not already saved, save it
      user.savedWorkouts.push({ workoutId: workoutId });
    } else {
      // if the workout is already saved, remove it
      user.savedWorkouts.splice(savedWorkoutIndex, 1);
    }

    // save the user
    await user.save();

    return new Response('Workout saved', { status: 200 });
  } catch (error) {
    logger.error(error);
    return new Response('Internal server error', { status: 500 });
  }
}