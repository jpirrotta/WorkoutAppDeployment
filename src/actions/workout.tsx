'use server';

import { dbConnect } from '@/lib/dbConnect';
import User from '@/models/userSchema';
import logger from '@/lib/logger';
import { NewWorkout, patchReqDataType, User as userType, Workout } from '@/types';
import { Document } from 'mongoose';

// Add a workout for a user
async function addWorkout(userId: string, workout: NewWorkout): Promise<{ title: string; message: string, createdWorkout?: Workout }> {
    logger.info('POST Workout action called');

    try {
        // Connect to the database
        await dbConnect();

        // Find the user
        const user: (userType & Document) | null = await User.findOne({ userId });

        if (!user) {
            logger.error('User not found!');
            return { title: 'User not found.', message: 'User you are trying to add Workout for does not exist in DB.' };
        }

        // Add the workout to the user's workouts
        user.workouts?.push(workout as any); // Temporarily cast to any, to bypass _id check
        await user.save();

        // Fetch the last workout (the one we added recently) with converting it to object
        const savedWorkout: Workout | undefined = user?.workouts?.slice(-1)[0]?.toObject();

        logger.info(`Added Workout: ${JSON.stringify({ savedWorkout })}`);

        // send the response msg
        return {
            title: 'Workout Created!',
            message: `Your Workout "${workout.name}" created successfully!`,
            createdWorkout: savedWorkout,
        };
    } catch (error) {
        if (error instanceof Error) {
            logger.error(`Error adding workout: ${error.message}`);
            throw new Error(`Error adding Workout: ${error.message}`);
        }
        logger.error(`Error adding workout: ${error}`);
        throw new Error(`Internal Server Error: ${error}`);
    }
}

// update a workout to edit exercises, name, public status, comments
async function updateWorkout(userId: string, workoutId: string, workoutUpdateData: patchReqDataType): Promise<{ title: string; message: string }> {
    logger.info('\n\nPATCH Workout action called');

    try {
        logger.info(`\n\nWorkout ID - ${workoutId}`);

        // Connect to the database
        await dbConnect();

        //get user
        let user = await User.findOne({ userId: userId });

        // If the user is not found return an error
        if (!user) {
            logger.error('User not found!');
            return { title: 'User not found.', message: 'User you are trying to update a Workout for does not exist in DB.' };
        }

        // Find the workout by its id
        const workout: Workout = user?.workouts?.id(workoutId);

        if (!workout) {
            logger.error('Workout not found!');
            return { title: 'Workout not found.', message: 'Unable to find Workout for current User' };
        }

        // set id for the exercise to be added
        if (workoutUpdateData.exercise) {
            const exerciseId: number = workout.exercises.length + 1
            workoutUpdateData.exercise.id = String(exerciseId)
        }

        logger.info(`Workout found, now updating...`);

        // Manually update workout fields (had issues using set method from mongoose)
        if (workoutUpdateData.name) {
            workout.name = workoutUpdateData.name;
        }
        if (workoutUpdateData.public !== undefined) {
            workout.public = workoutUpdateData.public;
        }
        if (workoutUpdateData.exercise) {
            workout.exercises.push(workoutUpdateData.exercise); // Assuming you want to add an exercise
        }
        if (workoutUpdateData.comments) {
            workout.comments = workoutUpdateData.comments;
        }

        // Update user
        await user.save();

        // Send the response with the confirmation message
        return {
            title: 'Workout Updated!',
            message: `Workout has been updated successfully!`,
        };
    } catch (error) {
        if (error instanceof Error) {
            logger.error(`Error updating workout: ${error.message}`);
            throw new Error(`Error updating Workout: ${error.message}`);
        }
        logger.error(`Error updating workouts: ${error}`);
        throw new Error(`Internal Server Error: ${error}`);
    }
}

// Delete a specific workout for a user
async function deleteWorkout(userId: string, workoutId: string): Promise<{ title: string; message: string }> {
    logger.info('DELETE all Workouts action called');

    try {
        // Connect to the database
        await dbConnect();

        // Find the user
        const user = await User.findOne({ userId });

        if (!user) {
            logger.error('User not found!');
            return { title: 'User not found.', message: 'User you are trying to delete a Workout for does not exist in DB.' };
        }

        // Find the workout by its id and remove it
        const workout: Document & Workout = user.workouts?.id(workoutId);
        if (!workout) {
            logger.error('Workout not found!');
            return { title: 'Workout not found.', message: 'Unable to find Workout for current User' };
        }

        // Remove the workout
        workout.deleteOne();

        await user.save();

        logger.info(`Workout deleted: ${workoutId}`);

        // Send the response with the updated workouts
        return {
            title: 'Workout Deleted!',
            message: `Your Workout named ${workout.name} deleted successfully!`,
        };
    } catch (error) {
        if (error instanceof Error) {
            logger.error(`Error deleting workout: ${error.message}`);
            throw new Error(`Error deleting Workout: ${error.message}`);
        }
        logger.error(`Error deleting workout: ${error}`);
        throw new Error(`Internal Server Error: ${error}`);
    }
}

// unused as of now since we don't have any feature for deleting all workouts at once, but might going ahead
// delete all workouts for a user
async function deleteAllWorkouts(userId: string): Promise<{ title: string; message: string }> {
    logger.info('\n\nDELETE Workout action called');
    try {
        // logs
        logger.info(`Request from userId: ${userId}`);

        // Connect to the database
        await dbConnect();

        // Find the user by their userId
        let user = await User.findOne({ userId: userId });

        // If the user is not found return an error
        if (!user) {
            logger.error('User not found!');
            return { title: 'User not found.', message: 'User you are trying to delete Workouts for does not exist in DB.' };
        }

        // if the user has no workouts return a message
        if (user.workouts?.length === 0) {
            logger.error('User found, but no Workouts exist!');
            return { title: 'No Workouts found', message: 'Seems like you have no Workouts to delete' };
        }

        // if the user is found delete all workouts
        logger.info('User found, deleting all workouts');

        // remove all workouts
        (user.workouts as Workout[]) = [];

        // update the user
        await user.save();

        // Send the response with the confirmation message
        return {
            title: 'Workouts Deleted!',
            message: `All of your Workouts are deleted successfully!`,
        };
    } catch (error) {
        if (error instanceof Error) {
            logger.error(`Error deleting workouts: ${error.message}`);
            throw new Error(`Error deleting Workouts: ${error.message}`);
        }
        logger.error(`Error deleting workouts: ${error}`);
        throw new Error(`Internal Server Error: ${error}`);
    }
}

export { addWorkout, deleteWorkout, deleteAllWorkouts, updateWorkout }