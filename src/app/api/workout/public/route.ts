// src/api/workout/isPublic/route.ts

import { dbConnect } from '@/lib/dbConnect';
import User from '@/models/userSchema';
import logger from '@/lib/logger';
import { NextRequest, NextResponse } from 'next/server';

interface RequestData {
  userId: string;
  workoutId: string;
  isPublic: boolean;
}

export async function PUT(req: NextRequest): Promise<NextResponse> {
  logger.info('\n\nPUT Publish/Unpublish Workout API called');
  try {
    // Get the request data
    const data: RequestData = await req.json();
    const { userId, workoutId, isPublic } = data;

    // logs
    logger.info(`Request data: ${JSON.stringify(data)}`);

    // Connect to the database
    await dbConnect();

    // find the owner of the workout
    let workoutOwner = await User.findOne({
      workouts: { $elemMatch: { _id: workoutId } },
    });

    // If the workoutOwner is not found return an error
    if (!workoutOwner) {
      logger.error(`User with this workout id ${workoutId} not found`);
      return new NextResponse('User not found', { status: 404 });
    }

    // log the workoutOwner name
    logger.info(`the workout owner User: ${workoutOwner.name}`);

    // set the isPublic field of the workout to the value of the isPublic field from the request body
    const result = await User.updateOne(
      { _id: workoutOwner._id, 'workouts._id': workoutId },
      { $set: { 'workouts.$.public': isPublic } }
    );

    // logs the number of documents modified
    logger.info(`isPublic field update :\n ${JSON.stringify(result)}`);

    const message = isPublic ? 'Workout published' : 'Workout unpublished';
    logger.info(message);
    return new NextResponse(message, { status: 200 });
  } catch (error) {
    logger.error(error);
    return new NextResponse('Internal server error', { status: 500 });
  }
}
