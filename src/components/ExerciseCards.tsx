'use client';
import ExerciseCard from './ExerciseCard';
import { Exercise } from '@/types';
import { cn } from '@/lib/utils';

interface ExerciseCardsProps {
  readonly exercises: Exercise[];
  closeIcon?: (exercise: Exercise) => React.ReactNode; // Changed from exerciseId
  CreateWorkoutFlag?: boolean;
  existingWorkoutFlag?: boolean;
}

export default function ExerciseCards({
  exercises,
  closeIcon,
  CreateWorkoutFlag,
  existingWorkoutFlag = true,
}: ExerciseCardsProps) {
  return (
    <div
      className={`grid grid-cols-1 mx-3 sm:grid-cols-2 ${!closeIcon && 'md:grid-cols lg:grid-cols-3'} xl:grid-cols-3 gap-8 xl:mx-auto xl:container ${!existingWorkoutFlag && 'overflow-y-auto h-[1000px] border border-gray-500 rounded-2xl p-5 shadow-2xl'}`}
    >
      {exercises.map((exercise) => (
        <ExerciseCard
          key={exercise._id?.toString() ?? exercise.id}
          exercise={exercise}
          closeIcon={closeIcon ? () => closeIcon(exercise) : undefined}
          CreateWorkoutFlag={CreateWorkoutFlag}
        />
      ))}
    </div>
  );
}
