'use client';
import ExerciseCard from './ExerciseCard';
import { Exercise } from '@/types';

interface ExerciseCardsProps {
  readonly exercises: Exercise[];
  closeIcon?: (exerciseId: string) => React.ReactNode;
  CreateWorkoutFlag?: boolean;
}

export default function ExerciseCards({ exercises, closeIcon, CreateWorkoutFlag }: ExerciseCardsProps) {
  return (
    <div className="grid grid-cols-1 mx-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3 gap-8 xl:mx-auto xl:container">
      {exercises.map((exercise) => (
        <ExerciseCard key={exercise.id} exercise={exercise} closeIcon={closeIcon} CreateWorkoutFlag={CreateWorkoutFlag} />
      ))}
    </div>
  );
}
