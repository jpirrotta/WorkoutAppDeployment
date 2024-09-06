// src/api/workout/comment/route.ts

import { dbConnect } from '@/lib/dbConnect';
import User, { UserDocument } from '@/models/userSchema';
import logger from '@/lib/logger';
import { NextRequest, NextResponse } from 'next/server';
import _ from 'lodash';

interface Comment {
  text: string;
  postedBy: string;
}

interface Workout {
  _id: string;
  comments: Comment[];
}

interface RequestDataPost {
  userId: string;
  comment: string;
  workoutId: string;
}

interface RequestDataDelete {
  userId: string;
  commentId: string;
  workoutId: string;
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  logger.info('\n\nPOST Comment Workout API called');
  try {
    // Get the request data
    const data: RequestDataPost = await req.json();
    const { userId, comment, workoutId } = data;
    //

    //logs
    logger.info(`Request data: ${JSON.stringify(data)}`);
    //

    // Connect to the database
    await dbConnect();

    // find the owner of the workout
    let workoutOwner: UserDocument | null = await User.findOne({
      workouts: { $elemMatch: { _id: workoutId } },
    });

    // find who commented the workout
    //! using Kelvin as for testing, change to userId later
    let user: UserDocument | null = await User.findOne({
      userId: 'user_2dOFzDbFGGG6oec9fRSltH7aGJY',
    });

    if (!user) {
      logger.error('User who commented the workout not found');
      return new NextResponse('User not found', { status: 404 });
    }

    logger.info(
      `User who commented the workout found: ${user.name + ' | ' + user._id}`
    );

    // If the workoutOwner is not found return an error
    if (!workoutOwner) {
      logger.error(`User with this workout id ${workoutId} not found`);
      return new NextResponse('User not found', { status: 404 });
    }

    //log the workoutOwner name
    logger.info(`the workout owner User: ${workoutOwner.name}`);

    // add a comment from the userID to the workoutOwner specific workout id
    const result = await User.updateOne(
      {
        _id: workoutOwner._id,
        workouts: { $elemMatch: { _id: workoutId } },
      },
      {
        $addToSet: {
          'workouts.$.comments': { text: comment, postedBy: user._id },
        },
      }
    );

    // logs the number of documents modified
    logger.info(result);

    // query the number of comments for a specific workout
    // from the workouts array of the workoutOwner
    const CommentedWorkout = workoutOwner.workouts?.find((workout) =>
      _.isEqual(workout._id, workoutId)
    );
    const comments = {
      comments: CommentedWorkout?.comments,
      commentsCount: CommentedWorkout?.comments.length,
    };
    logger.info('Comments: ' + comments.comments);

    return new NextResponse(JSON.stringify(comments), { status: 200 });
  } catch (error) {
    logger.error(`Error: ${error}`);
    return new NextResponse('An error occurred', { status: 500 });
  }
}

export async function DELETE(req: NextRequest): Promise<NextResponse> {
  logger.info('\n\nDELETE Comment Workout API called');
  try {
    // Get the request data
    const data: RequestDataDelete = await req.json();
    const { userId, commentId, workoutId } = data;

    //logs
    logger.info(`Request data: ${JSON.stringify(data)}`);
    //

    // Connect to the database
    await dbConnect();

    // find the owner of the workout
    let workoutOwner: UserDocument | null = await User.findOne({
      workouts: { $elemMatch: { _id: workoutId } },
    });

    // find who wants to remove his comment on workout
    //! using Kelvin as for testing, change to userId later
    let user: UserDocument | null = await User.findOne({
      userId: 'user_2dOFzDbFGGG6oec9fRSltH7aGJY',
    });

    if (!user) {
      logger.error('User who removes a comment to a workout not found');
      return new NextResponse('User not found', { status: 404 });
    }

    logger.info(
      `User who removes a comment to a workout found: ${
        user.name + ' | ' + user._id
      }`
    );

    // If the workoutOwner is not found return an error
    if (!workoutOwner) {
      logger.error(`User with this workout id ${workoutId} not found`);
      return new NextResponse('User not found', { status: 404 });
    }

    //log the workoutOwner name
    logger.info(`the workout owner User: ${workoutOwner.name}`);

    // remove a comment from the userID to the workoutOwner specific workout id
    const result = await User.updateOne(
      {
        _id: workoutOwner._id,
        workouts: { $elemMatch: { _id: workoutId } },
      },
      {
        $pull: {
          'workouts.$.comments': { _id: commentId },
        },
      }
    );

    // logs the number of documents modified
    logger.info(result);

    // query the number of comments for a specific workout
    // from the workouts array of the workoutOwner
    const CommentedWorkout = workoutOwner.workouts?.find((workout) =>
      _.isEqual(workout._id, workoutId)
    );
    const comments = {
      comments: CommentedWorkout?.comments,
      commentsCount: CommentedWorkout?.comments.length,
    };
    logger.info('Comments: ' + comments.comments);

    return new NextResponse(JSON.stringify(comments), { status: 200 });
  } catch (error) {
    logger.error(`Error: ${error}`);
    return new NextResponse('An error occurred', { status: 500 });
  }
}
