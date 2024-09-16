import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

import { useState } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';

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

interface ExerciseCardProps {
  readonly exercise: Exercise;
}

export default function ExerciseCard({ exercise }: ExerciseCardProps) {
  const [showDemo, setShowDemo] = useState(true);

  const ImageToggler = () => {
    setShowDemo((prev) => !prev);
  };

  return (
    <Card
      className="bg-slate-700 border-primary md:transform md:hover:scale-105 md:transition-transform md:duration-200"
      key={exercise.id}
    >
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
        <Button className="px-0" variant="link">
          Add To Workout
        </Button>
      </CardContent>
      <CardFooter className="capitalize text-secondary">
        <strong>Secondary Muscles:&nbsp;</strong>
        {exercise.secondaryMuscles.join(', ')}
      </CardFooter>
    </Card>
  );
}
