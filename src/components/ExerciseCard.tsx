import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import React, { useState } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import AddExerciseToWorkout from './workout/AddExerciseToWorkout';
import { Exercise } from '@/types';
import { useExerciseRemove } from '@/hooks/workout/useWorkoutMutations';

interface ExerciseCardProps {
  readonly exercise: Exercise;
  closeIcon?: (exerciseId: string) => React.ReactNode;
}

export default function ExerciseCard({ exercise, closeIcon }: ExerciseCardProps) {
  const [showDemo, setShowDemo] = useState(true);

  // mutation hook
  const ExerciseRemoveMutation = useExerciseRemove();

  const ImageToggler = () => {
    setShowDemo((prev) => !prev);
  };

  // const handleExerciseDelete = () => {
  //   ExerciseRemoveMutation.mutate(exercise.id);
  // }

  // // alert dialog for delete exercise from selected workout confirmation
  // const DeleteExerciseDialog = ({ triggerNode }: { triggerNode: React.ReactNode }) => (
  //   <AlertDialog>
  //     <AlertDialogTrigger asChild>
  //       {triggerNode}
  //     </AlertDialogTrigger>
  //     <AlertDialogContent className='border-border'>
  //       <AlertDialogHeader>
  //         <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
  //         <AlertDialogDescription>
  //           This action cannot be undone. This will remove the Exercise from your Workout.
  //         </AlertDialogDescription>
  //       </AlertDialogHeader>
  //       <AlertDialogFooter>
  //         <div className='flex w-full justify-between'>
  //           <AlertDialogCancel>Cancel</AlertDialogCancel>
  //           <AlertDialogAction>Continue</AlertDialogAction>
  //         </div>
  //       </AlertDialogFooter>
  //     </AlertDialogContent>
  //   </AlertDialog>
  // )

  return (
    <Card
      className="bg-slate-700 border-primary md:transform md:hover:scale-105 md:transition-transform md:duration-200"
      key={exercise.id}
    >
      {closeIcon && (
        // <DeleteExerciseDialog
        //   triggerNode={
        //     <div className='flex mt-2 mr-2 justify-end'>
        //       <X className='justify-end text-primary hover:cursor-pointer hover:opacity-70' />
        //     </div>
        //   }
        // />
        <>
          {closeIcon(exercise.id)}
        </>
      )}
      <CardHeader>
        <CardTitle className="text-secondary uppercase text-center">
          {exercise.name}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {showDemo ? (
          <div className="flex justify-center items-center flex-col">
            <Image
              src={exercise.gifUrl}
              alt={exercise.name}
              width={350}
              height={125}
              className="rounded-md"
              unoptimized
            />
            <Button className="px-0" variant="link" onClick={ImageToggler}>
              Hide Demo
            </Button>
          </div>
        ) : (
          <Button className="px-0" variant="link" onClick={ImageToggler}>
            Show Demo
          </Button>
        )}
        <CardDescription className="text-secondary capitalize">
          <strong>Target:</strong> {exercise.target}
          <br />
          <strong>Equipment:</strong> {exercise.equipment}
          <br />
          <strong>Body Part:</strong> {exercise.bodyPart}
          <br />
        </CardDescription>
        <br />

        {/* modal trigger btn for adding exercise to desired workout */}
        <AddExerciseToWorkout
          triggerNode={
            <Button className="px-0" variant="link">
              Add To Workout
            </Button>
          }
          exerciseToAdd={exercise}
        />
      </CardContent>

      <CardFooter className="capitalize text-secondary">
        <strong>Secondary Muscles:&nbsp;</strong>
        {exercise.secondaryMuscles.join(', ')}
      </CardFooter>
    </Card>
  );
}