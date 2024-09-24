// src/components/workout/MyWorkout.jsx

import { FC } from 'react';
import ExerciseCards from '../ExerciseCards';
import { Exercise, Workout } from '@/types';
import Link from 'next/link';
import { Trash2 } from 'lucide-react';
import { useWorkoutDelete, useExerciseRemove } from '@/hooks/workout/useWorkoutMutations';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { truncateText } from '@/utils/trucateText';
import { X } from 'lucide-react';

type MyWorkoutProps = {
    workout: Workout
    setWorkout: (workout: Workout | null) => void
}

const MyWorkout: FC<MyWorkoutProps> = ({ workout, setWorkout }) => {
    // mutation hooks
    const workoutDeleteMutation = useWorkoutDelete();
    const ExerciseRemoveMutation = useExerciseRemove();

    const handleDeleteWorkout = () => {
        workoutDeleteMutation.mutate(workout._id);

        setWorkout(null)
    }

    const handleExerciseDelete = (exerciseId: string) => {
        ExerciseRemoveMutation.mutate({ workoutId: workout._id.toString(), ExerciseId: exerciseId },
            {
                onSuccess: () => {
                    // Update the workout state to remove the exercise
                    const updatedExercises: Exercise[] = workout.exercises.filter(exercise => exercise.id !== exerciseId);
                    setWorkout({ ...workout as any, exercises: updatedExercises });
                }
            });
    }

    // alert dialog for delete workout confirmation
    const DeleteWorkoutDialog = ({ triggerNode }: { triggerNode: React.ReactNode }) => (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                {triggerNode}
            </AlertDialogTrigger>
            <AlertDialogContent className='border-border'>
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete your
                        Workout <i><b className='text-md'>&apos; {truncateText(workout.name)} &apos;</b></i>.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <div className='flex w-full justify-between'>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDeleteWorkout} >Continue</AlertDialogAction>
                    </div>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )

    // alert dialog for delete exercise from selected workout confirmation
    const DeleteExerciseDialog = ({ triggerNode, exerciseId }: { triggerNode: React.ReactNode, exerciseId: string }) => (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                {triggerNode}
            </AlertDialogTrigger>
            <AlertDialogContent className='border-border'>
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This action cannot be undone. This will remove the Exercise from your Workout.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <div className='flex w-full justify-between'>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleExerciseDelete(exerciseId)}>Continue</AlertDialogAction>
                    </div>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )

    // handle generating closeIcon for exercise cards
    const generateCloseIcon: (exerciseId: string) => React.ReactNode = (exerciseId: string) => (
        <DeleteExerciseDialog
            exerciseId={exerciseId}
            triggerNode={
                <div className='flex mt-2 mr-2 justify-end'>
                    <X className='justify-end text-primary hover:cursor-pointer hover:opacity-70' />
                </div>
            }
        />
    );

    // if workout has exercises, display them or else related message
    return (
        <div className='bg-background gap-10'>
            <div className='flex justify-between sm:px-20 px-5 pt-10'>
                <h1 className='text-2xl font-bold text-primary break-words w-2/5' style={{ hyphens: 'auto' }}>{workout?.name}</h1>
                <DeleteWorkoutDialog triggerNode={<Trash2 className='text-text hover:text-primary hover:cursor-pointer' />} />
            </div>
            {workout?.exercises.length ? (
                <div className='mt-10'>
                    <ExerciseCards
                        exercises={workout.exercises}
                        closeIcon={generateCloseIcon}
                    />
                </div>
            ) : (
                <p className='w-full mt-10 text-center'>
                    There seems to be no exercise in selected workout yet.{' '}
                    <Link className='text-primary' href="/exercises">
                        Try adding some!
                    </Link>
                </p>
            )
            }
        </div>
    )
}

export default MyWorkout;