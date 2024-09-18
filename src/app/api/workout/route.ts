// src/app/api/workout/route.ts
import { dbConnect } from '@/lib/dbConnect';
import User from '@/models/userSchema';
import { WorkoutModel, ExerciseModel } from '@/models/workoutSchema';
import logger from '@/lib/logger';
import { NextRequest, NextResponse } from 'next/server';
import { Workout, User as userType } from '@/types';
import { Exercise } from '@/types/workout';
import { Document } from 'mongoose';

interface RequestData {
  userId: string;
  name: string;
  workout: {
    name: string;
    exercises: Exercise[];
  };
}

// GET /api/workout - get all workouts for current user
export async function GET(req: NextRequest): Promise<NextResponse> {
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
    let curUser: userType | null = await User.findOne({ userId: userId });

    // If the user is not found return an error
    if (!curUser) {
      logger.error('User not found');
      return new NextResponse('User not found', { status: 404 });
    }

    // If the user is found, return their workouts
    logger.info('User found, returning workouts');
    //

    const workouts: ((Workout[] & Document) | undefined) = curUser.workouts;

    //if no workouts found then return a message notifying
    if (workouts?.length === 0) {
      logger.info('No workouts found');
      return new NextResponse('No workouts found!', {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    //logging user workouts
    logger.info(`Workouts (${workouts?.length}): ${JSON.stringify(workouts)}`);

    // send the response with workouts
    return new NextResponse(JSON.stringify(workouts), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    if (error instanceof Error) {
      logger.error(`GET Workout API error: ${error.message}`);
      return new NextResponse(error.message, { status: 500 });
    }
    logger.error(`GET Workout API error: ${error}`);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  logger.info('\n\nPOST Workout API called');
  try {
    // Get the request data
    const data: RequestData = await req.json();
    const { userId, name, workout } = data;

    // logs
    logger.info(`Request data: ${JSON.stringify(data)}`);
    logger.info(`userId: ${userId}`);
    logger.info(`name: ${name}`);
    logger.info(`workout: ${JSON.stringify(workout)}`);
    logger.info(`workout name: ${workout.name}`);
    logger.info(`workout exercises: ${JSON.stringify(workout.exercises)}`);

    // Connect to the database
    await dbConnect();

    // Find the user by their userId
    let user = await User.findOne({ userId: userId });

    // If the user is not found return an error
    if (!user) {
      logger.error('User not found');
      return new NextResponse('User not found', { status: 404 });
    }

    // if the user is found create a new workout
    logger.info('User found, creating new workout');

    // create the array of exercises
    const exercises = workout.exercises.map(
      (exercise) =>
        new ExerciseModel({
          id: exercise.id,
          bodyPart: exercise.bodyPart,
          equipment: exercise.equipment,
          name: exercise.name,
          target: exercise.target,
          secondaryMuscles: exercise.secondaryMuscles,
          instructions: exercise.instructions,
        })
    );

    // create a new workout
    const newWorkout = new WorkoutModel({
      name: workout.name,
      exercises: exercises,
    });

    // add the workout to the user's workouts
    user.workouts?.push(newWorkout);

    // save the user
    await user.save();

    // send the response
    return new NextResponse(JSON.stringify({ message: 'OK' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    if (error instanceof Error) {
      logger.error(`POST Workout API error: ${error.message}`);
      return new NextResponse(`Internal Server Error: ${error.message}`, {
        status: 500,
      });
    }
    logger.error(`POST Workout API error: ${error}`);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

export async function DELETE(req: NextRequest): Promise<NextResponse> {
  logger.info('\n\nDELETE Workout API called');
  try {
    // Get the request data
    const data: { userId: string } = await req.json();
    const { userId } = data;

    // logs
    logger.info(`Request data: ${JSON.stringify(data)}`);

    // Connect to the database
    await dbConnect();

    // Find the user by their userId
    let user: (userType & Document) | null = await User.findOne({ userId: userId });

    // If the user is not found return an error
    if (!user) {
      logger.error('User not found');
      return new NextResponse('User not found', { status: 404 });
    }

    // if the user has no workouts return a message
    if (user.workouts?.length === 0) {
      logger.info('User Found but has no workouts');
      return new NextResponse(JSON.stringify({ message: 'OK' }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // if the user is found delete all workouts
    logger.info('User found, deleting all workouts');

    // remove all workouts
    (user.workouts as Workout[]) = [];

    // update the user
    await user.save();

    // send the response
    return new NextResponse(JSON.stringify({ message: 'OK' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    if (error instanceof Error) {
      logger.error(`DELETE Workout API error: ${error.message}`);
      return new NextResponse(error.message, { status: 500 });
    }
    logger.error(`DELETE Workout API error: ${error}`);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}