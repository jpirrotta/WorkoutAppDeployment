// src/app/api/workout/route.js
import { dbConnect } from '@/lib/dbConnect';
import User from '@/models/userSchema';
import { Workout, Exercise } from '@/models/workoutSchema';
import logger from '@/lib/logger';

export async function POST(req, res) {
  logger.info('\n\nPOST Workout API called');
  try {
    // Get the request data
    const data = await req.json();
    const { userId, name, workout } = data;
    //

    // logs
    logger.info(`Request data: ${JSON.stringify(data)}`);
    logger.info(`userId: ${userId}`);
    logger.info(`name: ${name}`);
    logger.info(`workout: ${JSON.stringify(workout)}`);
    logger.info(`workout name: ${workout.name}`);
    logger.info(`workout exercises: ${JSON.stringify(workout.exercises)}`);
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

    // if the user is found create a new workout
    logger.info('User found, creating new workout');

    if (!workout || !workout.name) {
      logger.error('Workout name is required');
    }
    // create the array of exercises
    const exercises = [];
    workout.exercises.forEach((exercise) => {
      const newExercise = new Exercise({
        id: exercise.id,
        bodyPart: exercise.bodyPart,
        equipment: exercise.equipment,
        name: exercise.name,
        target: exercise.target,
        secondaryMuscles: exercise.secondaryMuscles,
        instructions: exercise.instructions,
      });
      exercises.push(newExercise);
    });
    // create a new workout
    const newWorkout = new Workout({
      name: workout.name,
      exercises: exercises,
    });

    // add the workout to the user's workouts
    user.workouts.push(newWorkout);

    // save the user
    await user.save();

    // send the response
    return new Response(JSON.stringify({ message: 'OK' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    logger.error(`POST Workout API error: ${error}`);
    return new Response(error.message, { status: 500 });
  }
}

export async function DELETE(req, res) {
  logger.info('\n\nDELETE Workout API called');
  try {
    // Get the request data
    const data = await req.json();
    const { userId } = data;

    // logs
    logger.info(`Request data: ${JSON.stringify(data)}`);
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

    // if the user has no workouts return a message
    if (user.workouts.length === 0) {
      logger.info('User Found but has no workouts');
      return new Response(JSON.stringify({ message: 'OK' }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // if the user is found delete all workouts
    logger.info('User found, deleting all workouts');

    // remove all workouts
    user.workouts = [];

    // update the user
    await user.save();

    // send the response
    return new Response(JSON.stringify({ message: 'OK' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    logger.error(`DELETE Workout API error: ${error}`);
    return new Response(error.message, { status: 500 });
  }
}
