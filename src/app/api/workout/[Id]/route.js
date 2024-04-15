// src/app/api/workout/[id].js
import { dbConnect } from '@/lib/dbConnect';
import { Workout } from '@/models/workoutSchema';
import logger from '@/lib/logger';
import User from '@/models/userSchema';

export async function GET(req, res) {
  logger.info(`\n\nGET Workout API called - ${JSON.stringify(req.url)}`);

  // Get a workout ID and userId from URL
  const id = req.url.split('/')[5].split('?')[0];
  const userId = req.url.split('?')[1].split('=')[1];
  logger.info(
    `\n\nGET req queries - ${JSON.stringify(id)} -- ${JSON.stringify(userId)}`
  );

  try {
    // Get the workout id as after the last slash in the url and userId after ?, assuming userId is not the only query param
    // Get the workout id by splitting the url assuming that id is the last part of the url
    logger.info(`\n\nWorkout ID - ${id}`);

    // Connect to the database
    await dbConnect();

    const user = await User.findOne({ userId: userId });

    if (!user) {
      logger.error('User not found');
      return new Response(JSON.stringify('User not found.', { status: 404 }));
    }

    logger.info('User found, finding workout...');

    // Find the workout by its id
    const workout = user.workouts.find((workout) => workout._id == id);

    if (!workout) {
      logger.error('Workout not found!');
      return new Response(
        JSON.stringify('Workout not found!!', { status: 404 })
      );
    }

    logger.info(`Workout Found: ${JSON.stringify({ workout })}`);

    // Send the response with the workout
    return new Response(JSON.stringify({ workout }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    logger.error(`Error fetching workout: ${error}`);
    return new Response(
      JSON.stringify('Error fetching workout.', { status: 500 })
    );
  }
}

// PATCH /api/workout/[id] - update a workout to add exercises
export async function PATCH(req, res) {
  logger.info('\n\nPATCH Workout API called');

  try {
    // Get the request data
    const data = await req.json();
    const { userId, exercise } = data;

    // get id from url
    const workoutId = req.url.split('/')[req.url.split('/').length - 1];

    logger.info(`\n\nWorkout ID - ${workoutId}`);

    // Connect to the database
    await dbConnect();

    //get user
    let user = await User.findOne({ userId: userId });

    if (!user) {
      logger.error('User not found');
      return new Response(JSON.stringify('User not found.', { status: 404 }));
    }

    // Find the workout by its id
    const workout = user.workouts.id(workoutId);
    if (!workout) {
      logger.error('Workout not found!');
      return new Response(
        JSON.stringify('Workout not found!', { status: 404 })
      );
    }
    //getting id for the exercise to be added
    const exerciseId = workout.exercises.length + 1
    exercise.id = exerciseId

    logger.info(`Workout found, now adding exercise...`);

    // Add the exercise to the workout
    await user.workouts.id(workoutId).exercises.push(exercise);

    // Update user
    await user.save();

    // Send success response
    return new Response(
      JSON.stringify({ message: 'Exercise added to workout successfully!' }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    logger.error(`Error adding exercise to workout: ${error}`);
    return new Response(
      JSON.stringify({ message: 'Error adding exercise to workout.' })
    );
  }
}

export async function PUT(req, res) {
  logger.info('\n\nPUT Workout API called');

  try {
    // Get the request data
    const data = await req.json();
    const { userId, updateWorkout } = data;

    // get id from url
    const workoutId = req.url.split('/')[req.url.split('/').length - 1];

    // Connect to the database
    await dbConnect();

    // Find the user by their userId
    const user = await User.findOne({ userId: userId });

    // If the user is not found return an error
    if (!user) {
      logger.error('User not found');
      return new Response(JSON.stringify('User not found.', { status: 404 }));
    }

    // Log the user
    logger.info('User found, Updating workout...');

    // Find the workout by its id
    const workout = user.workouts.id(workoutId);

    if (!workout) {
      logger.error('User not found');
      return new Response(JSON.stringify('User not found.', { status: 404 }));
    }

    logger.info(`Workout found, now updating...`);

    //TODO: Add validation for the workout data!!

    // Update the workout
    await user.workouts.id(workoutId).set(updateWorkout);
    await user.save();

    logger.info(`Workout Updated: ${JSON.stringify({ workout })}`);

    // Send the response with the workout
    return new Response(
      JSON.stringify({ message: 'Workout updated successfully!' }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    logger.error(`Error updating workout: ${error}`);
    return res.status(500).json({ message: 'Error updating workout.' });
  }
}

export async function DELETE(req, res) {
  logger.info('\n\nDELETE Workout API called');

  try {
    // Get the request data
    const data = await req.json();
    const { userId } = data;

    // get id from url
    const workoutId = req.url.split('/')[req.url.split('/').length - 1];

    logger.info(`\n\nWorkout ID - ${workoutId}`);

    // Connect to the database
    await dbConnect();

    //get user
    let user = await User.findOne({ userId: userId });

    // Find the workout by its id
    const workout = user.workouts.find((workout) => workout._id == workoutId);

    if (!workout) {
      logger.error('User not found');
      return new Response(JSON.stringify('User not found.', { status: 404 }));
    }

    logger.info(`Workout found, now deleting...`);

    // Delete the workout
    await workout.deleteOne();

    // Update user
    await user.save();

    // Send success response
    return new Response(
      JSON.stringify({ message: 'Workout deleted successfully!' }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    logger.error(`Error fetching workout: ${error}`);
    return res.status(500).json({ message: 'Error fetching workout.' });
  }
}
