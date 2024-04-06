// src/api/workout/comment/route.js

import { dbConnect } from '@/lib/dbConnect';
import User from '@/models/userSchema';
import logger from '@/lib/logger';

export async function POST(req, res) {
  logger.info('\n\nPOST Comment Workout API called');
  try {
    // Get the request data
    const data = await req.json();
    const { userId, comment, workoutId } = data;
    //

    //logs
    logger.info(`Request data: ${JSON.stringify(data)}`);
    //

    // Connect to the database
    await dbConnect();

    // find the owner of the workout
    let workoutOwner = await User.findOne({
      workouts: { $elemMatch: { _id: workoutId } },
    });

    // find who commented the workout
    //! using Kelvin as for testing, change to userId later
    let user = await User.findOne({
      userId: 'user_2dOFzDbFGGG6oec9fRSltH7aGJY',
    });

    logger.info(
      `User who commented the workout found: ${user.name + ' | ' + user._id}`
    );

    // If the workoutOwner is not found return an error
    if (!workoutOwner) {
      logger.error(`User with this workout id ${workoutId} not found`);
      return new Response(JSON.stringify('User not found', { status: 404 }));
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
    const CommentedWorkout = workoutOwner.workouts.id(workoutId);
    const comments = {
      comments: CommentedWorkout.comments,
      commentsCount: CommentedWorkout.comments.length,
    };
    logger.info('Comments: ' + comments.comments);

    return new Response(JSON.stringify(comments), { status: 200 });
  } catch (error) {
    logger.error(`Error: ${error}`);
    return new Response(JSON.stringify('An error occurred', { status: 500 }));
  }
}

export async function DELETE(req, res) {
  logger.info('\n\nDELETE Comment Workout API called');
  try {
    // Get the request data
    const data = await req.json();
    const { userId, commentId, workoutId } = data;

    //logs
    logger.info(`Request data: ${JSON.stringify(data)}`);
    //

    // Connect to the database
    await dbConnect();

    // find the owner of the workout
    let workoutOwner = await User.findOne({
      workouts: { $elemMatch: { _id: workoutId } },
    });

    // find who wants to remove his comment on workout
    //! using Kelvin as for testing, change to userId later
    let user = await User.findOne({
      userId: 'user_2dOFzDbFGGG6oec9fRSltH7aGJY',
    });

    logger.info(
      `User who removes a comment to a workout found: ${user.name + ' | ' + user._id}`
    );

    // If the workoutOwner is not found return an error
    if (!workoutOwner) {
      logger.error(`User with this workout id ${workoutId} not found`);
      return new Response(JSON.stringify('User not found', { status: 404 }));
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
    const CommentedWorkout = workoutOwner.workouts.id(workoutId);
    const comments = {
      comments: CommentedWorkout.comments,
      commentsCount: CommentedWorkout.comments.length,
    };
    logger.info('Comments: ' + comments.comments);

    return new Response(JSON.stringify(comments), { status: 200 });
  } catch (error) {
    logger.error(`Error: ${error}`);
    return new Response(JSON.stringify('An error occurred', { status: 500 }));
  }
}
