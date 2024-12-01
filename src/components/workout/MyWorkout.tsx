// src/components/workout/MyWorkout.jsx
'use client';
// react and next imports
import { FC, memo, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import logger from '@/lib/logger';

// UI imports
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
} from '@/components/ui/menubar';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Trash2, CirclePlay, X, EllipsisVertical } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';

// method and component imports
import { truncateText } from '@/utils/trucateText';
import { Exercise, Sets, Workout } from '@/types';
import ExerciseCards from '../ExerciseCards';
import ExercisePage from '../ExercisePage';
import { useSetAtom } from 'jotai';
import { setsMissingExerciseAtom } from '@/store';
import { useExercises } from '@/utils/fetchData';

type MyWorkoutProps = {
  workout: Workout;
  setWorkout: (workout: number | null) => void;
};

const MyWorkout: FC<MyWorkoutProps> = ({ workout, setWorkout }) => {
  const router = useRouter();
  const addExerciseSectionRef = useRef<HTMLDivElement>(null);
  const [deleteExeDialogOpen, setDeleteExeDialogOpen] = useState(false);
  const [missingSetsDialogOpen, setMissingSetsDialogOpen] = useState(false);
  const setSetsMissingExercise = useSetAtom(setsMissingExerciseAtom);
  const [workoutExercises, setWorkoutExercises] = useState<Exercise[]>([]);
  const { data: allExercises, error } = useExercises();

  useEffect(() => {
    if (error) {
      toast.error('Seems like there was an issue getting your Exercises :(', {
        description: error.message,
      });
    }

    if (allExercises) {
      logger.info(`Fetched ${allExercises.length} exercises`);

      // filter the exercises that are in the workout
      const filteredExercises = workout.exercises.map((exercise) => {
        // overriding the exercise we are finding since we are sure that it exists
        const workoutExe = allExercises.find((e) => e.id === exercise.id)!;

        return {
          _id: exercise._id,
          ...workoutExe,
          sets: exercise?.sets || [],
        }
      })

      if (filteredExercises.length > 0) {
        setWorkoutExercises(filteredExercises);
      }
      else {
        logger.error(`No exercises found in the workout`);
      }
    }
  }
    , [error, allExercises, workout.exercises]);

  // mutation hooks
  const workoutDeleteMutation = useWorkoutDelete();
  const ExerciseRemoveMutation = useExerciseRemove();
  const workoutUpdateMutation = useWorkoutUpdate();

  const handleDeleteWorkout = () => {
    workoutDeleteMutation.mutate(workout._id!);

    setWorkout(null);
  };

  const handlePlayWorkout = () => {
    // check if all the exercises have sets data to play current workout, if not, show an alert and point out those exercises
    const exerciseIds = workout.exercises
      .filter((exercise) => exercise.sets?.length < 1)
      .map((exercise) => exercise._id!.toString());

    if (exerciseIds.length > 0) {
      logger.error(`Sets missing in one or more exercises: ${exerciseIds.length}`);
      toast.error('Sets missing in one or more exercises');
      setSetsMissingExercise(exerciseIds);
      setMissingSetsDialogOpen(true);
      return;
    }
    router.push(`/workout/${workout._id}/${workout.name}`);
  };

  // MyWorkout.tsx
  const handleExerciseDelete = (exercise: Exercise) => {
    ExerciseRemoveMutation.mutate(
      {
        workoutId: workout._id!,
        ExerciseId: exercise._id!.toString(),
      },
      {
        onSuccess: () => {
          const updatedExercises = workoutExercises.filter(
            (e) => e._id!.toString() !== exercise._id!.toString()
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

  // alert dialog for restricting user to play workout without sets in any of the sets
  const HandleSetsMissing = memo(function HandleSetsMissing({
    triggerNode,
  }: {
    triggerNode?: React.ReactNode;
  }) {
    return (
      <AlertDialog
        open={missingSetsDialogOpen}
        onOpenChange={setMissingSetsDialogOpen}
      >
        <AlertDialogTrigger asChild>{triggerNode}</AlertDialogTrigger>
        <AlertDialogContent className="border-border">
          <AlertDialogHeader>
            <AlertDialogTitle>Missing Sets in one or more exercises?</AlertDialogTitle>
            <AlertDialogDescription>
              Workout cannot be played without sets in all exercises. Please add sets to all exercises to play the workout.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className='w-full'>OK</AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    );
  });

  // alert dialog for delete workout confirmation
  const DeleteWorkoutDialog = memo(function DeleteWorkoutDialog({
    triggerNode,
  }: {
    triggerNode?: React.ReactNode;
  }) {
    return (
      <AlertDialog
        open={deleteExeDialogOpen}
        onOpenChange={setDeleteExeDialogOpen}
      >
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
    exercise,
  }: {
    triggerNode: React.ReactNode;
    exercise: Exercise;
  }) {
    return (
      <AlertDialog>
        <div className="flex mt-2 mr-2 justify-end">
          <AlertDialogTrigger asChild>{triggerNode}</AlertDialogTrigger>
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
              <AlertDialogAction onClick={() => handleExerciseDelete(exercise)}>
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
          <MenubarTrigger>
            <EllipsisVertical />
          </MenubarTrigger>
          <MenubarContent className="pb-2 space-y-2">
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
            <MenubarItem onClick={navigateToAddExerciseSection}>
              Add Exercises
              <MenubarShortcut className="text-2xl">+</MenubarShortcut>
            </MenubarItem>
          </MenubarContent>
        </MenubarMenu>
      </Menubar>
    );
  });

  const ExerciseExistingList = () => (
    <Accordion type="single" defaultValue='existing-accor' collapsible className="w-full">
      <AccordionItem value='existing-accor'>
        <AccordionTrigger className={`border border-gray-500 rounded-xl px-2`}>
          <div className={`flex items-center justify-between space-x-4 px-4`}>
            <h4 className="text-primary md:text-2xl">Existing Exercise List</h4>
          </div>
        </AccordionTrigger>
        <AccordionContent>
          <div className="mt-10">
            <ExerciseCards
              exercises={workoutExercises}
              closeIcon={generateCloseIcon}
            />
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );

  // handle generating closeIcon for exercise cards
  const generateCloseIcon = (exercise: Exercise): React.ReactNode => (
    <DeleteExerciseDialog
      exercise={exercise}
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

      <HandleSetsMissing />

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

      <div className="mt-16" ref={addExerciseSectionRef}>
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="workout-item-1">
            <AccordionTrigger className="border border-gray-500 rounded-xl px-2">
              <div
                className={`flex items-center justify-between space-x-4 px-4`}
              >
                <h4 className="text-primary md:text-2xl">
                  Add More Exercises to Workout
                </h4>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <ExercisePage
                title=" "
                workout={workout}
                workoutFlag={true}
                navbarFlag={false}
              />
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  );
};

export default MyWorkout;
