import {
  useMutation,
  UseMutationResult,
  useQueryClient,
} from '@tanstack/react-query';
import { toast } from 'sonner';
import {
  addWorkout,
  deleteWorkout,
  updateWorkout,
  removeExercise,
  updateExerciseSets,
  saveWorkoutHistory,
} from '@/actions/workout';
import {
  NewWorkout,
  patchReqDataType,
  Workout,
  Sets,
  WorkoutHistory,
} from '@/types';
import { useUser } from '@clerk/clerk-react';
import logger from '@/lib/logger';

// State management for invalidating public workouts if publicity of a workout changes
import { useAtomValue } from 'jotai';
import { pageAtom, itemsPerPageAtom } from '@/store';

// create new workout
export const useWorkoutCreate = (): UseMutationResult<
  { title: string; message: string; createdWorkout?: Workout }, // TData: The response from the mutation
  unknown, // TError: Could be unknown or Error
  NewWorkout, // TVariables: The data passed to the mutation function
  unknown // TContext: Context not used here, so it's unknown
> => {
  const { user } = useUser();
  const userId = user?.id ?? '';
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (workout: NewWorkout) => {
      return addWorkout(userId, workout);
    },
    onSuccess: (data, variables) => {
      toast.success(data.title, { description: data.message });
      queryClient.invalidateQueries({
        queryKey: ['workouts', userId],
      });

      if (data) {
        return data;
      }
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
export const useWorkoutUpdate = (): UseMutationResult<
  { title: string; message: string },
  unknown,
  { workoutId: string; workoutData: patchReqDataType },
  unknown
> => {
  const { user } = useUser();
  const userId = user?.id ?? '';
  const queryClient = useQueryClient();

  // State management
  const page = useAtomValue(pageAtom);
  const itemsPerPage = useAtomValue(itemsPerPageAtom);

  return useMutation({
    mutationFn: (variables: {
      workoutId: string;
      workoutData: patchReqDataType;
    }) => {
      return updateWorkout(userId, variables.workoutId, variables.workoutData);
    },

    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['workouts', userId],
      });

      queryClient.invalidateQueries({
        queryKey: ['public-workouts', page, itemsPerPage],
      });
      logger.info('Workout updated successfully');
      if (variables.workoutData.exerciseArr) {
        return;
      }
      toast.success(data.title, { description: data.message });
    },

    onError: (error) => {
      toast.error('Something went wrong', {
        description:
          error instanceof Error ? error.message : 'Please try again',
      });
    },
  });
};

// update the Workout exercise sets
export const useWorkoutExerciseUpdate = (): UseMutationResult<
  { title: string; message: string },
  unknown,
  {
    workoutId: string;
    exerciseId: string;
    sets: Sets;
  },
  unknown
> => {
  const { user } = useUser();
  const userId = user?.id ?? '';
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (variables: {
      workoutId: string;
      exerciseId: string;
      sets: Sets;
    }) => {
      return updateExerciseSets(
        userId,
        variables.workoutId,
        variables.exerciseId,
        variables.sets
      );
    },

    onSuccess: (data, variables) => {
      // Only invalidate queries if not saving to history
      queryClient.invalidateQueries({
        queryKey: ['workouts', userId],
      });
      console.info('Workout Exercise updated successfully');
      toast.success(data.title, { description: data.message });
    },

    onError: (error) => {
      toast.error('Something went wrong', {
        description:
          error instanceof Error ? error.message : 'Please try again',
      });
    },
  });
};

// remove an exercise from a workout
export const useExerciseRemove = (): UseMutationResult<
  { title: string; message: string },
  unknown,
  { workoutId: string; ExerciseId: string },
  unknown
> => {
  const { user } = useUser();
  const userId = user?.id ?? '';
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (variables: { workoutId: string; ExerciseId: string }) => {
      return removeExercise(userId, variables.workoutId, variables.ExerciseId);
    },

    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['workouts', userId],
      });

      logger.info('exercise removed successfully');
      toast.success(data.title, { description: data.message });
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
export const useWorkoutDelete = (): UseMutationResult<
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
      return deleteWorkout(userId, workoutId);
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

export const useWorkoutHistorySave = (): UseMutationResult<
  { title: string; message: string },
  unknown,
  WorkoutHistory,
  unknown
> => {
  const { user } = useUser();
  const userId = user?.id ?? '';
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (historyData: WorkoutHistory) => {
      return saveWorkoutHistory(userId, historyData);
    },

    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ['workoutHistory', userId],
      });
      logger.info('Workout history saved successfully');
      // toast.success(data.title, { description: data.message });
    },

    onError: (error) => {
      toast.error('Something went wrong', {
        description:
          error instanceof Error ? error.message : 'Please try again',
      });
    },
  });
};
