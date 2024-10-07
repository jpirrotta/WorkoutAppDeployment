// src/services/workoutService.ts
import { Workout, Exercise } from '@/types';

// Define the base URL for workout API
const API_BASE_URL = '/api/workout';

// Function to fetch all workouts for a user
async function getUserWorkouts(userId: string): Promise<Workout[] | null> {
    try {
        const response = await fetch(`${API_BASE_URL}?userId=${userId}`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
        });

        if (!response.ok) {
            console.error(`Error fetching workouts: ${JSON.stringify(response)}`);
            return null;
        }

        const data = await response.json();
        return data.workouts;
    } catch (error) {
        console.error(`Error in getUserWorkouts: ${error}`);
        return null;
    }
}

// Function to add a new workout for a user
async function addUserWorkout(userId: string, workout: Workout): Promise<boolean> {
    try {
        const response = await fetch(API_BASE_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId, workout }),
        });

        if (!response.ok) {
            console.error(`Error adding workout: ${JSON.stringify(response)}`);
            return false;
        }

        return true;
    } catch (error) {
        console.error(`Error in addUserWorkout: ${error}`);
        return false;
    }
}

// Function to delete all workouts for a user
async function deleteUserWorkouts(userId: string): Promise<boolean> {
    try {
        const response = await fetch(API_BASE_URL, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId }),
        });

        if (!response.ok) {
            console.error(`Error deleting workouts: ${JSON.stringify(response)}`);
            return false;
        }

        return true;
    } catch (error) {
        console.error(`Error in deleteUserWorkouts: ${error}`);
        return false;
    }
}

export { getUserWorkouts, addUserWorkout, deleteUserWorkouts };