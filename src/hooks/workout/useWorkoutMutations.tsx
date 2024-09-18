import {
  useMutation,
  UseMutationResult,
  useQueryClient,
} from '@tanstack/react-query';
import { toast } from 'sonner';
import { addWorkout, deleteWorkout, updateWorkout } from '@/actions/workout';
import { NewWorkout, Workout, patchReqDataType } from '@/types';
import { useUser } from '@clerk/clerk-react';

// create new workout
const useWorkoutCreate = (
): UseMutationResult<
  { title: string; message: string }, // TData: The response from the mutation
  unknown, // TError: Could be unknown or Error
  NewWorkout, // TVariables: The data passed to the mutation function
  unknown // TContext: Context not used here, so it's unknown
> => {
  const { user } = useUser();
  const userId = user?.id ?? '';
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (workout: NewWorkout) => {
      return addWorkout(userId, workout)
    },
    onSuccess: (data, variables) => {
      toast.success(data.title, { description: data.message });
      queryClient.invalidateQueries({
        queryKey: ['workouts', userId],
      });
    },
    onError: (error) => {
      toast.error('Something went wrong', {
        description:
          error instanceof Error ? error.message : 'Please try again',
      });
    },
  });
};

// update a workout
const useWorkoutUpdate = (
): UseMutationResult<
  { title: string; message: string },
  unknown,
  { workoutId: string, workoutData: patchReqDataType },
  unknown
> => {
  const { user } = useUser();
  const userId = user?.id ?? '';
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (variables: { workoutId: string, workoutData: patchReqDataType }) => {
      return updateWorkout(userId, variables.workoutId, variables.workoutData)
    },
    onSuccess: (data, variables) => {
      toast.success(data.title, { description: data.message });
      queryClient.invalidateQueries({
        queryKey: ['workouts', userId],
      });
    },
    onError: (error) => {
      toast.error('Something went wrong', {
        description:
          error instanceof Error ? error.message : 'Please try again',
      });
    },
  });
};

// delete a workout
const useWorkoutDelete = (
): UseMutationResult<
  { title: string; message: string },
  unknown,
  string,
  unknown
> => {
  const { user } = useUser();
  const userId = user?.id ?? '';
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (workoutId: string) => {
      return deleteWorkout(userId, workoutId)
    },
    onSuccess: (data, variables) => {
      toast.success(data.title, { description: data.message });
      queryClient.invalidateQueries({
        queryKey: ['workouts', userId],
      });
    },
    onError: (error) => {
      toast.error('Something went wrong', {
        description:
          error instanceof Error ? error.message : 'Please try again',
      });
    },
  });
};

export { useWorkoutCreate, useWorkoutDelete, useWorkoutUpdate };
