// src/components/workout/MyWorkout.jsx
'use client';
import { FC, memo } from 'react';
import ExerciseCards from '../ExerciseCards';
import { Exercise, Workout } from '@/types';
import Link from 'next/link';
import { Trash2, CirclePlay } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    useWorkoutDelete,
    useExerciseRemove,
    useWorkoutUpdate,
} from '@/hooks/workout/useWorkoutMutations';
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
} from '@/components/ui/alert-dialog';
import { truncateText } from '@/utils/trucateText';
import { X } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useRouter } from 'next/navigation';

type MyWorkoutProps = {
    workout: Workout
    setWorkout: (workout: number | null) => void
}

const MyWorkout: FC<MyWorkoutProps> = ({ workout, setWorkout }) => {
    const router = useRouter();
    // mutation hooks
    const workoutDeleteMutation = useWorkoutDelete();
    const ExerciseRemoveMutation = useExerciseRemove();
    const workoutUpdateMutation = useWorkoutUpdate();

    const handleDeleteWorkout = () => {
        workoutDeleteMutation.mutate(workout._id);

        setWorkout(null);
    }

    const handlePlayWorkout = () => {
        router.push(`/workout/${workout._id}/${workout.name}`);
    };

    const handleExerciseDelete = (exerciseId: string) => {
        ExerciseRemoveMutation.mutate(
            { workoutId: workout._id.toString(), ExerciseId: exerciseId },
            {
                onSuccess: () => {
                    // Update the workout state to remove the exercise
                    const updatedExercises: Exercise[] = workout.exercises.filter(
                        (exercise) => exercise.id !== exerciseId
                    );
                },
            }
        );
    };

    const handleUpdateWorkoutVisibility = () => {
        const updatedWorkout = {
            ...workout,
            public: !workout.public,
        };

        workoutUpdateMutation.mutate({
            workoutId: workout._id,
            workoutData: updatedWorkout,
        });
    };

    // alert dialog for delete workout confirmation
    const DeleteWorkoutDialog = memo(function DeleteWorkoutDialog({
        triggerNode,
    }: {
        triggerNode: React.ReactNode;
    }) {
        return (
            <AlertDialog>
                <AlertDialogTrigger asChild>{triggerNode}</AlertDialogTrigger>
                <AlertDialogContent className="border-border">
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete your
                            Workout{' '}
                            <i>
                                <b className="text-md">
                                    &apos; {truncateText(workout.name)} &apos;
                                </b>
                            </i>
                            .
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <div className="flex w-full justify-between">
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={handleDeleteWorkout}>
                                Continue
                            </AlertDialogAction>
                        </div>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        );
    });

    // alert dialog for delete exercise from selected workout confirmation
    const DeleteExerciseDialog = memo(function DeleteExerciseDialog({
        triggerNode,
        exerciseId,
    }: {
        triggerNode: React.ReactNode;
        exerciseId: string;
    }) {
        return (
            <AlertDialog>
                <AlertDialogTrigger asChild>{triggerNode}</AlertDialogTrigger>
                <AlertDialogContent className="border-border">
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will remove the Exercise from
                            your Workout.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <div className="flex w-full justify-between">
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                                onClick={() => handleExerciseDelete(exerciseId)}
                            >
                                Continue
                            </AlertDialogAction>
                        </div>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        );
    });

    // handle generating closeIcon for exercise cards
    const generateCloseIcon: (exerciseId: string) => React.ReactNode = (
        exerciseId: string
    ) => (
        <DeleteExerciseDialog
            exerciseId={exerciseId}
            triggerNode={
                <div className="flex mt-2 mr-2 justify-end">
                    <X className="justify-end text-primary hover:cursor-pointer hover:opacity-70" />
                </div>
            }
        />
    );

    // if workout has exercises, display them or else related message
    return (
        <div className="bg-background gap-10">
            <div className="flex justify-between sm:px-20 px-5 pt-10">
                <h1 className="text-2xl font-bold text-primary break-words w-2/5 hyphens-auto">
                    {workout.name}
                </h1>
                <div className="flex items-center gap-10">
                    <div className="flex items-center">
                        <Label htmlFor="workout-name" className="mr-2">
                            Public
                        </Label>
                        <Switch
                            id="airplane-mode"
                            checked={workout.public}
                            onCheckedChange={handleUpdateWorkoutVisibility}
                        />
                    </div>
                    <Button variant="icon" size="icon" onClick={handlePlayWorkout}>
                        <CirclePlay />
                    </Button>
                    <DeleteWorkoutDialog
                        triggerNode={
                            <Button variant="icon" size="icon">
                                <Trash2 />
                            </Button>
                        }
                    />
                </div>
            </div>

            {workout.exercises.length ? (
                <div className="mt-10">
                    <ExerciseCards
                        exercises={workout.exercises}
                        closeIcon={generateCloseIcon}
                    />
                </div>
            ) : (
                <p className="w-full mt-10 text-center">
                    There seems to be no exercise in selected workout yet.{' '}
                    <Link className="text-primary" href="/exercises">
                        Try adding some!
                    </Link>
                </p>
            )}
        </div>
    );
};

export default MyWorkout;
