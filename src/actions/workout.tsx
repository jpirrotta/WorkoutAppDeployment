'use server';

import { NextRequest, NextResponse } from 'next/server';
import { dbConnect } from '@/lib/dbConnect';
import User from '@/models/userSchema';
import logger from '@/lib/logger';
import { useUser } from '@clerk/nextjs';

// Add a workout for a user
async function addAWorkout(req: NextRequest): Promise<NextResponse> {
    logger.info('POST Workout action called');

    try {
        // Get the request data
        const data = await req.json();
        const { userId, workout } = data;

        // Connect to the database
        await dbConnect();

        // Find the user
        const user = await User.findOne({ userId });

        if (!user) {
            logger.error('User not found');
            return new NextResponse('User not found.', { status: 404 });
        }

        // Add the workout to the user's workouts
        user?.workouts?.push(workout);
        await user.save();

        logger.info(`Workout added: ${JSON.stringify(workout)}`);

        // Send the response with the updated workouts
        return NextResponse.json('Workout added successfully!', { status: 200 });
    } catch (error) {
        if (error instanceof Error) {
            logger.error(`Error adding workout: ${error.message}`);
            return NextResponse.json(error.message, { status: 500 });
        }
        logger.error(`Error adding workout: ${error}`);
        return NextResponse.json('Internal Server Error', { status: 500 });
    }
}

// Delete all workouts for a user
async function deleteAllWorkout(req: NextRequest): Promise<NextResponse> {
    logger.info('DELETE all Workouts action called');

    try {
        // Get the workout ID from the URL
        const workoutId = req.url.split('/').pop();

        // Get the userId from the query parameters
        const { searchParams } = new URL(req.url);
        const userId = searchParams.get('userId');

        // Connect to the database
        await dbConnect();

        // Find the user
        const user = await User.findOne({ userId });

        if (!user) {
            logger.error('User not found');
            return new NextResponse('User not found.', { status: 404 });
        }

        // Find the workout by its id and remove it
        const workout = user.workouts?.id(workoutId);
        if (!workout) {
            logger.error('Workout not found!');
            return new NextResponse('Workout not found!', { status: 404 });
        }

        workout.remove();
        await user.save();

        logger.info(`Workout deleted: ${workoutId}`);

        // Send the response with the updated workouts
        return new NextResponse('Workout deleted successfully!', { status: 200 });
    } catch (error) {
        if (error instanceof Error) {
            logger.error(`Error deleting workout: ${error.message}`);
            return new NextResponse(error.message, { status: 500 });
        }
        logger.error(`Error deleting workout: ${error}`);
        return new NextResponse('Internal Server Error', { status: 500 });
    }
}

export { addAWorkout, deleteAllWorkout }