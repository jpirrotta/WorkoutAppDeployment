// src/components/workout/MyWorkout.jsx
'use client';
import { FC, memo, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAtom } from 'jotai';
import { selectedExercisesAtom } from '@/store';

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
import {
    Menubar,
    MenubarContent,
    MenubarItem,
    MenubarMenu,
    MenubarSeparator,
    MenubarShortcut,
    MenubarTrigger,
} from "@/components/ui/menubar"
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"
import { truncateText } from '@/utils/trucateText';
import { Trash2, CirclePlay, X, EllipsisVertical } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';

import { Exercise, Workout } from '@/types';
import ExerciseCards from '../ExerciseCards';
import ExercisePage from '../ExercisePage';

type MyWorkoutProps = {
    workout: Workout
    setWorkout: (workout: number | null) => void
}

const MyWorkout: FC<MyWorkoutProps> = ({ workout, setWorkout }) => {
    const router = useRouter();
    const addExerciseSectionRef = useRef<HTMLDivElement>(null);
    const [deleteExeDialogOpen, setDeleteExeDialogOpen] = useState(false);

    // mutation hooks
    const workoutDeleteMutation = useWorkoutDelete();
    const ExerciseRemoveMutation = useExerciseRemove();
    const workoutUpdateMutation = useWorkoutUpdate();

    const handleDeleteWorkout = () => {
        workoutDeleteMutation.mutate(workout._id!);

        setWorkout(null);
    }

    const handlePlayWorkout = () => {
        router.push(`/workout/${workout._id}/${workout.name}`);
    };

    const handleExerciseDelete = (exerciseId: string) => {
        ExerciseRemoveMutation.mutate(
            { workoutId: workout._id!, ExerciseId: exerciseId },
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
            workoutId: workout._id!,
            workoutData: updatedWorkout,
        });
    };

    // alert dialog for delete workout confirmation
    const DeleteWorkoutDialog = memo(function DeleteWorkoutDialog({
        triggerNode,
    }: {
        triggerNode?: React.ReactNode;
    }) {
        return (
            <AlertDialog open={deleteExeDialogOpen} onOpenChange={setDeleteExeDialogOpen}>
                <AlertDialogTrigger asChild>
                    {triggerNode}
                </AlertDialogTrigger>
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
                <div className="flex mt-2 mr-2 justify-end">
                    <AlertDialogTrigger asChild>
                        {triggerNode}
                    </AlertDialogTrigger>
                </div>
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

    const WorkoutMenuBar = memo(function WorkoutMenuBar() {
        return (
            <Menubar>
                <MenubarMenu>
                    <MenubarTrigger><EllipsisVertical /></MenubarTrigger>
                    <MenubarContent className='pb-2 space-y-2'>
                        <MenubarItem onClick={handlePlayWorkout}>
                            Play it
                            <MenubarShortcut>
                                <CirclePlay />
                            </MenubarShortcut>
                        </MenubarItem>
                        <MenubarItem onClick={() => setDeleteExeDialogOpen(true)}>
                            Delete
                            <MenubarShortcut>
                                <Trash2 />
                            </MenubarShortcut>
                        </MenubarItem>
                        <MenubarSeparator />
                        <MenubarItem onClick={navigateToAddExerciseSection}>Add Exercises
                            <MenubarShortcut className='text-2xl'>
                                +
                            </MenubarShortcut>
                        </MenubarItem>
                    </MenubarContent>
                </MenubarMenu>
            </Menubar>
        );
    });

    const ExerciseExistingList = () => (
        <Accordion type="single" collapsible className="w-full">
            <AccordionItem value='item-1'>
                <AccordionTrigger className='border border-gray-500 rounded-xl px-2'>
                    <div className={`flex items-center justify-between space-x-4 px-4`}>
                        <h4 className="text-primary md:text-2xl">
                            Existing Exercise List
                        </h4>
                    </div>
                </AccordionTrigger>
                <AccordionContent>
                    <div className="mt-10">
                        <ExerciseCards
                            exercises={workout.exercises}
                            closeIcon={generateCloseIcon}
                        />
                    </div>
                </AccordionContent>
            </AccordionItem>
        </Accordion>
    );

    // handle generating closeIcon for exercise cards
    const generateCloseIcon: (exerciseId: string) => React.ReactNode = (
        exerciseId: string
    ) => (
        <DeleteExerciseDialog
            exerciseId={exerciseId}
            triggerNode={
                <X className="justify-end text-primary hover:cursor-pointer hover:opacity-70" />
            }
        />
    );

    // handle navigating user to exercise list to add section
    const navigateToAddExerciseSection = () => {
        if (addExerciseSectionRef.current) {
            addExerciseSectionRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    };

    // if workout has exercises, display them or else related message
    return (
        <div className="bg-background gap-10">
            <div className="flex items-center justify-between sm:px-20 px-5 my-10">
                <h1 className="text-2xl font-bold text-primary break-words w-2/5 hyphens-auto">
                    {workout.name}
                </h1>
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
                <WorkoutMenuBar />
            </div>

            <DeleteWorkoutDialog />

            {workout.exercises.length ? (
                ExerciseExistingList()
            ) : (
                <p className="w-full mt-10 text-center">
                    There seems to be no exercise in selected workout yet.{' '}
                    <Link className="text-primary" href="/exercises">
                        Try adding some!
                    </Link>
                </p>
            )}

            <div className='mt-16' ref={addExerciseSectionRef}>
                <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value='workout-item-1'>
                        <AccordionTrigger className='border border-gray-500 rounded-xl px-2'>
                            <div className={`flex items-center justify-between space-x-4 px-4`}>
                                <h4 className="text-primary md:text-2xl">
                                    Add More Exercises to Workout
                                </h4>
                            </div>
                        </AccordionTrigger>
                        <AccordionContent>
                            <ExercisePage title=' ' workout={workout} workoutFlag={true} navbarFlag={false} />
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>
            </div>
        </div>
    );
};

export default MyWorkout;
