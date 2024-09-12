// src/api/workout/like/route.ts
import { dbConnect } from '@/lib/dbConnect';
import UserModel, { UserDocument } from '@/models/userSchema';
import logger from '@/lib/logger';
import { NextRequest, NextResponse } from 'next/server';
import _ from 'lodash';

interface RequestData {
  userId: string;
  workoutId: string;
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  logger.info('\n\nPOST Like Workout API called');
  try {
    // Get the request data
    const data: RequestData = await req.json();
    const { userId, workoutId } = data;
    //

    //logs
    logger.info(`Request data: ${JSON.stringify(data)}`);
    //

    // Connect to the database
    await dbConnect();

    // find the owner of the workout
    let workoutOwner: UserDocument | null = await UserModel.findOne({
      workouts: { $elemMatch: { _id: workoutId } },
    });

    // find who liked the workout
    //! using Kelvin as for testing, change to userId later
    let user: UserDocument | null = await UserModel.findOne({
      userId: 'user_2dOFzDbFGGG6oec9fRSltH7aGJY',
    });

    if (!user) {
      logger.error('User who liked the workout not found');
      return new NextResponse('User not found', { status: 404 });
    }

    logger.info(
      `User who liked the workout found: ${user.name + ' | ' + user._id}`
    );

    // If the workoutOwner is not found return an error
    if (!workoutOwner) {
      logger.error(`User with this workout id ${workoutId} not found`);
      return new NextResponse('User not found', { status: 404 });
    }

    //log the workoutOwner name
    logger.info(`the workout owner User: ${workoutOwner.name}`);

    // add a like from the userID to the workoutOwner specific workout id
    const result = await UserModel.updateOne(
      {
        _id: workoutOwner._id,
        workouts: { $elemMatch: { _id: workoutId } },
      },
      {
        $addToSet: { 'workouts.$.likes': user._id },
      }
    );

    // logs the number of documents modified
    logger.info(result);

    // query the number of likes for a specific workout
    // from the workouts array of the workoutOwner
    const LikedWorkout = workoutOwner.workouts?.find((workout) =>
      _.isEqual(workout._id, workoutId)
    );

    const likesCount = {
      likes: LikedWorkout?.likes.length,
    };

    logger.info('Workout liked');
    // return 200 with the number of likes
    return new NextResponse(JSON.stringify(likesCount ?? 0), { status: 200 });
  } catch (error) {
    logger.error(`Error: ${error}`);
    return new NextResponse('Error', { status: 500 });
  }
}

export async function DELETE(req: NextRequest): Promise<NextResponse> {
  logger.info('\n\nDELETE Like Workout API called');
  try {
    // Get the request data
    const data: RequestData = await req.json();
    const { userId, workoutId } = data;
    //

    //logs
    logger.info(`Request data: ${JSON.stringify(data)}`);
    //

    // Connect to the database
    await dbConnect();

    // find the owner of the workout that is being unlike
    let workoutOwner: UserDocument | null = await UserModel.findOne({
      workouts: { $elemMatch: { _id: workoutId } },
    });

    // find who liked the workout
    let user: UserDocument | null = await UserModel.findOne({
      userId: 'user_2dOFzDbFGGG6oec9fRSltH7aGJY',
    });

    if (!user) {
      logger.error('User who unliked the workout not found');
      return new NextResponse('User not found', { status: 404 });
    }

    logger.info(`User who unlike the workout: ${user.name + ' | ' + user._id}`);
    // If the workoutOwner is not found return an error
    if (!workoutOwner) {
      logger.error(`User with this workout id ${workoutId} not found`);
      return new NextResponse('User not found', { status: 404 });
    }

    //log the workoutOwner name
    logger.info(`the workout owner is User found: ${workoutOwner.name}`);

    // remove a like from the userID to the workoutOwner specific workout id
    const result = await UserModel.updateOne(
      {
        _id: workoutOwner._id,
        workouts: { $elemMatch: { _id: workoutId } },
      },
      {
        $pull: { 'workouts.$.likes': user._id },
      }
    );

    // logs the number of documents modified
    logger.info(result);

    // query the number of likes for a specific workout
    // from the workouts array of the workoutOwner
    const LikedWorkout = workoutOwner.workouts?.find((workout) =>
      _.isEqual(workout._id, workoutId)
    );

    const likesCount = {
      likes: LikedWorkout?.likes.length,
    };

    logger.info('Likes count: ' + likesCount.likes);

    logger.info('Workout unlike');
    // return 200 with the number of likes
    return new NextResponse(JSON.stringify(likesCount ?? 0), { status: 200 });
  } catch (error) {
    logger.error(`Error: ${error}`);
    return new NextResponse('Error', { status: 500 });
  }
}
