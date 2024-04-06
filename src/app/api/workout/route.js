// src/app/api/workout/route.js
import { dbConnect } from '@/lib/dbConnect';
import User from '@/models/userSchema';
import { Workout, Exercise } from '@/models/workoutSchema';
import logger from '@/lib/logger';
// import { useUser } from '@clerk/clerk-react';

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
      return new Response(JSON.stringify('User not found', { status: 404 }));
    }

    // if the user is found create a new workout
    logger.info('User found, creating new workout');

    //? probably not needed as the workout name is required in the schema
    // ? and it will throw an error if it is not there
    // if (!workout || !workout.name) {
    //   logger.error('Workout name is required');
    // }

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
      return new Response(JSON.stringify('User not found', { status: 404 }));
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

// GET /api/workout - get all workouts for current user
export async function GET(req, res) {
  logger.info('\n\nGET User Workout API called');

  // use the useUser hook to get the current user
  // const { user } = useUser();
  // critical default values
  // const userId = user?.id;
  try {
    const { searchParams } = new URL(req.url);
    // Get the userId from the query parameters
    const userId = searchParams.get('userId');
    
    // logs
    logger.info(`User with ID [${JSON.stringify(userId)}] requested their workouts`);
    //

    // Connect to the database
    await dbConnect();

    // Find the user by their userId
    let curUser = await User.findOne({ userId: userId });

    // If the user is not found return an error
    if (!curUser) {
      logger.error('User not found');
      return new Response(JSON.stringify('User not found', { status: 404 }));
    }

    // If the user is found, return their workouts
    logger.info('User found, returning workouts');
    const workouts = curUser.workouts;

    //logging user workouts
    logger.info(`Workouts: ${JSON.stringify(workouts)}`);

    // send the response with workouts
    return new Response(JSON.stringify({ workouts }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    logger.error(`GET Workout API error: ${error}`);
    return new Response(error.message, { status: 500 });
  }
}
