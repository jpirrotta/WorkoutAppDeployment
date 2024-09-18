import { useQuery, UseQueryResult, useQueryClient } from '@tanstack/react-query';
import { useUser } from '@clerk/clerk-react';
import { BaseWorkout, NewWorkout, Workout } from '@/types';

// fetch all workouts for the current user
const fetchUserWorkouts = async (
    userId: string,
    signal: AbortSignal
): Promise<Workout[]> => {
    // no need for try catch, react-query will handle the error and the rest is handled by the api
    const response = await fetch(`/api/workout?userId=${userId}`, { signal });
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch user workouts');
    }
    return response.json();
};

const useGetAllUserWorkouts = (): UseQueryResult<Workout[], Error> => {
    const { user } = useUser();
    const userId = user?.id ?? '';
    return useQuery({
        queryKey: ['workouts', userId],
        queryFn: async ({ signal }) => await fetchUserWorkouts(userId, signal),
        enabled: !!userId,
        retry: false,
    });
};


// unused as of now since we are getting the workout from the cache but might need going ahead
// fetch a specific workout for the current user
const fetchUserWorkoutSpecific = async (
    userId: string,
    workoutId: string,
    signal: AbortSignal
): Promise<Workout> => {
    // no need for try catch, react-query will handle the error and the rest is handled by the api
    const response = await fetch(`/api/workout/${workoutId}?userId=${userId}`, { signal });
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch user workouts');
    }
    return response.json();
};

const useGetWorkoutById = (workoutId: string): Workout | undefined => {
    const { user } = useUser();
    const userId = user?.id ?? '';
    const queryClient = useQueryClient();

    // Retrieve cached workouts
    const cachedWorkouts = queryClient.getQueryData<Workout[]>(['workouts', userId]);

    // Find the specific workout by ID from cached data (workouts)
    const workout = cachedWorkouts?.find((w: Workout) => w._id === workoutId);

    return workout;
};

export { useGetAllUserWorkouts, useGetWorkoutById };