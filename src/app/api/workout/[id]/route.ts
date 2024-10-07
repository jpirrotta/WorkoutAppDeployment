// src/app/api/workout/[id].js
import { dbConnect } from '@/lib/dbConnect';
import logger from '@/lib/logger';
import User from '@/models/userSchema';
import { NextRequest, NextResponse } from 'next/server';
import { Workout, User as userType } from '@/types';
import { Document } from 'mongoose';
import { currentUser } from '@clerk/nextjs/server';

export async function GET(req: NextRequest): Promise<NextResponse> {
    const user = await currentUser();
    logger.info(`\n\nGET Workout API called - ${JSON.stringify(req.url)}`);

    // Get a workout ID and userId from URL
    const id = req.url.split('/')[5].split('?')[0];
    const userId = user?.id;
    // const userId = req.url.split('?')[1].split('=')[1];
    logger.info(
        `\n\nGET req queries - ${JSON.stringify(id)} -- ${JSON.stringify(userId)}`
    );

    try {
        logger.info(`\n\nWorkout ID - ${id}`);

        // Connect to the database
        await dbConnect();

        const user: userType | null = await User.findOne({ userId: userId });

        if (!user) {
            logger.error('User not found');
            return NextResponse.json('User not found.', { status: 404 });
        }

        logger.info('User found, finding workout...');

        if (!user.workouts) {
            logger.error('User does not have any workouts!');
            return NextResponse.json({ status: 204 });
        }

        // Find the workout by its id
        const workout = user?.workouts?.id(id);

        if (!workout) {
            logger.error('Workout not found!');
            return NextResponse.json('Workout not found!!', { status: 404 })
        }

        logger.info(`Workout Found: ${JSON.stringify({ workout })}`);

        // Send the response with the workout
        return NextResponse.json(workout, { status: 200 });
    } catch (error) {
        logger.error(`Error fetching workout: ${error}`);
        return NextResponse.json('Error fetching workout.', { status: 500 })
    }
}

// PATCH /api/workout/[id] - update a workout to add exercises
export async function PATCH(req: NextRequest): Promise<NextResponse> {
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
        let user: ((userType & Document) | null) = await User.findOne({ userId: userId });

        if (!user) {
            logger.error('User not found');
            return NextResponse.json('User not found.', { status: 404 });
        }

        // Find the workout by its id
        const workout: Workout = user?.workouts?.id(workoutId);

        if (!workout) {
            logger.error('Workout not found!');
            return NextResponse.json('Workout not found!', { status: 404 })
        }
        //getting id for the exercise to be added
        const exerciseId = workout.exercises.length + 1
        exercise.id = exerciseId

        logger.info(`Workout found, now adding exercise...`);

        // Add the exercise to the workout
        await user?.workouts?.id(workoutId).exercises.push(exercise);

        // Update user
        await user.save();

        // Send success response
        return NextResponse.json('Exercise added to workout successfully!', { status: 200, });
    } catch (error) {
        logger.error(`Error adding exercise to workout: ${error}`);
        return NextResponse.json('Error adding exercise to workout.', { status: 500 });
    }
}

export async function PUT(req: NextRequest): Promise<NextResponse> {
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
            return NextResponse.json('User not found.', { status: 404 });
        }

        // Log the user
        logger.info('User found, Updating workout...');

        // Find the workout by its id
        const workout = user?.workouts?.id(workoutId);

        if (!workout) {
            logger.error('User not found');
            return NextResponse.json('User not found.', { status: 404 });
        }

        logger.info(`Workout found, now updating...`);

        //TODO: Add validation for the workout data!!

        // Update the workout
        await user?.workouts?.id(workoutId).set(updateWorkout);
        await user.save();

        logger.info(`Workout Updated: ${JSON.stringify({ workout })}`);

        // Send the response with the workout
        return NextResponse.json('Workout updated successfully!', { status: 200 });
    } catch (error) {
        logger.error(`Error updating workout: ${error}`);
        return NextResponse.json('Error Updating Workout!', { status: 500 });
    }
}

export async function DELETE(req: NextRequest): Promise<NextResponse> {
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
        let user: (userType & Document) | null = await User.findOne({ userId: userId });

        if (!user) {
            logger.error('User not found');
            return NextResponse.json('User not found.', { status: 404 });
        }

        // Find the workout by its id
        const workout: Workout | undefined = user?.workouts?.id(workoutId);

        if (!workout) {
            logger.error('Workout not found');
            return NextResponse.json('Workout not found, so no action taken!', { status: 404 });
        }

        logger.info(`Workout found, now deleting...`);

        // Delete the workout
        await workout.deleteOne();

        // Update user
        await user?.save();

        // Send success response
        return new NextResponse(
            JSON.stringify({ message: 'Workout deleted successfully!' }),
            {
                status: 200,
                headers: { 'Content-Type': 'application/json' },
            }
        );
    } catch (error) {
        logger.error(`Error deleting workout: ${error}`);
        return NextResponse.json('Error deleting workout!', { status: 500 });
    }
}