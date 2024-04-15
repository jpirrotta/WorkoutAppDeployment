// src/api/workout/like/route.js
import { dbConnect } from '@/lib/dbConnect';
import User from '@/models/userSchema';
import logger from '@/lib/logger';

export async function POST(req, res) {
  logger.info('\n\nPOST Like Workout API called');
  try {
    // Get the request data
    const data = await req.json();
    const { userId, workoutId } = data;
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

    // find who liked the workout
    let user = await User.findOne({
      userId: userId,
    });

    logger.info(
      `User who liked the workout found: ${user.name + ' | ' + user._id}`
    );

    // If the workoutOwner is not found return an error
    if (!workoutOwner) {
      logger.error(`User with this workout id ${workoutId} not found`);
      return new Response(JSON.stringify('User not found', { status: 404 }));
    }

    //log the workoutOwner name
    logger.info(`the workout owner User: ${workoutOwner.name}`);

    // add a like from the userID to the workoutOwner specific workout id
    const result = await User.updateOne(
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
    const LikedWorkout = workoutOwner.workouts.id(workoutId);
    const likesCount = {
      likes: LikedWorkout.likes.length,
    };

    logger.info('Likes count: ' + likesCount.likes);

    logger.info('Workout liked');
    // return 200 with the number of likes
    return new Response(JSON.stringify(likesCount), { status: 200 });
  } catch (error) {
    logger.error(`Error: ${error}`);
    return new Response(JSON.stringify('Error', { status: 500 }));
  }
}

export async function DELETE(req, res) {
  logger.info('\n\nDELETE Like Workout API called');
  try {
    // Get the request data
    const data = await req.json();
    const { userId, workoutId } = data;
    //

    //logs
    logger.info(`Request data: ${JSON.stringify(data)}`);
    //

    // Connect to the database
    await dbConnect();

    // find the owner of the workout that is being unlike
    let workoutOwner = await User.findOne({
      workouts: { $elemMatch: { _id: workoutId } },
    });

    // find who liked the workout
    let user = await User.findOne({
      userId: userId,
    });

    logger.info(
      `User who unlike the workout: ${user.name + ' | ' + user._id}`
    );
    // If the workoutOwner is not found return an error
    if (!workoutOwner) {
      logger.error(`User with this workout id ${workoutId} not found`);
      return new Response(JSON.stringify('User not found', { status: 404 }));
    }

    //log the workoutOwner name
    logger.info(`the workout owner is User found: ${workoutOwner.name}`);

    // remove a like from the userID to the workoutOwner specific workout id
    const result = await User.updateOne(
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
    const LikedWorkout = workoutOwner.workouts.id(workoutId);
    const likesCount = {
      likes: LikedWorkout.likes.length,
    };

    logger.info('Likes count: ' + likesCount.likes);

    logger.info('Workout unlike');
    // return 200 with the number of likes
    return new Response(JSON.stringify(likesCount), { status: 200 });
  } catch (error) {
    logger.error(`Error: ${error}`);
    return new Response(JSON.stringify('Error', { status: 500 }));
  }
}
