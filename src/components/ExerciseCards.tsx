'use client';
import ExerciseCard from './ExerciseCard';

// TODO see the Exercise type in src/types/workout.ts
// combine them somehow
interface Exercise {
  id: string;
  name: string;
  gifUrl: string;
  target: string;
  equipment: string;
  bodyPart: string;
  secondaryMuscles: string[];
}

interface ExerciseCardsProps {
  readonly exercises: Exercise[];
}

export default function ExerciseCards({ exercises }: ExerciseCardsProps) {
  return (
    <div className="grid grid-cols-1 mx-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3 gap-8 xl:mx-auto xl:container">
      {exercises.map((exercise) => (
        <ExerciseCard key={exercise.id} exercise={exercise} />
      ))}
    </div>
  );
}
