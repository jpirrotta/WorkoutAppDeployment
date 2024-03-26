// src/api/workout/like/route.js
import { dbConnect } from '@/lib/dbConnect';
import User from '@/models/userSchema';
import { Workout, Exercise } from '@/models/workoutSchema';
import logger from '@/lib/logger';
import mongoose from 'mongoose';

export async function PUT(req, res) {
  logger.info('\n\nPUT Like Workout API called');
  try {
    // Get the request data
    const data = await req.json();
    const { userId, workoutId } = data;
    //

    //logs
    logger.info(`Request data: ${JSON.stringify(data)}`);
    logger.info(`userId: ${userId}`);
    logger.info(`workoutId: ${workoutId}`);
    //

    // Connect to the database
    await dbConnect();

    // find the owner of the workout
    let workoutOwner = await User.findOne({
      workouts: { $elemMatch: { _id: workoutId } },
    });

    // find who liked the workout
    // kelvin
    let user = await User.findOne({ _id: '65ee62ab31b43889d4a39d8c' });

    logger.info(`Like User found: ${user.name + ' | ' + user._id}`);

    // If the workoutOwner is not found return an error
    if (!workoutOwner) {
      logger.error('User not found');
      return new Response('User not found', { status: 404 });
    }

    //log the workoutOwner name
    logger.info(`the workout owner is User found: ${workoutOwner.name}`);

    // add a like from the userID to the workoutOwner specific workout id
    const result = workoutOwner.workouts.id(workoutId).likes;
    result.push(user._id);

    console.log(result); // prints the number of documents modified
    logger.info('Workout liked');
    return new Response('Workout liked', { status: 200 });
  } catch (error) {
    logger.error(`Error: ${error}`);
    return new Response('Error', { status: 500 });
  }
}
