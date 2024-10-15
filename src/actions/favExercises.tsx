'use server';

// src/actions/favExercises.tsx

import { dbConnect } from '@/lib/dbConnect';
import UserModel from '@/models/userSchema';
import logger from '@/lib/logger';



//Add a fav exercise to the user's favorites, takes an exercise id and user id
// Add a fav exercise to the user's favorites, takes an exercise id and user id
export async function addFavoriteExercise(userId: string, exerciseId: string): Promise<{ title: string; message: string }> {
    await dbConnect();

    try {
        const user = await UserModel.findOne({ userId });

        if (!user) {
            throw new Error(`User with ID ${userId} not found`);
        }

        // Initialize favExercises if it's undefined
        if (!user.favExercises) {
            user.favExercises = [];
        }

        // Append the new exercise ID to the current list of favorite exercises
        if (!user.favExercises.includes(exerciseId)) {
            user.favExercises.push(exerciseId);
            await user.save();
        }

        return { title: 'Success', message: 'Favorite exercise added successfully' };
    } catch (error) {
        logger.error('Failed to add favorite exercise:', error);
        throw new Error('Failed to add favorite exercise');
    }
}


// remove the exercise from the user's favorites
export async function removeFavoriteExercise(userId: string, exerciseId: string): Promise<{ title: string; message: string }> {
    await dbConnect();

    try {
        const user = await UserModel.findOne({ userId });

        if (!user) {
            throw new Error(`User with ID ${userId} not found`);
        }

        // Remove the exercise ID from the current list of favorite exercises
        if (user.favExercises) {
            user.favExercises = user.favExercises.filter((id) => id !== exerciseId);
            await user.save();
        } else {
            return { title: 'Failure', message: 'No favExercises array on this user!' };
        }

        return { title: 'Success', message: 'Favorite exercise removed successfully' };
    } catch (error) {
        logger.error('Failed to remove favorite exercise:', error);
        throw new Error('Failed to remove favorite exercise');
    }
}