'use client';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/Card';

import { useState } from 'react';
import Image from 'next/image';
import { Button } from './ui/Button';

export default function ExerciseCards({ exercises }) {
  const [showDemo, setShowDemo] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const ImageToggler = () => {
    setShowDemo((prev) => !prev);
  };

  const ExpandToggler = () => {
    setExpanded((prev) => !prev);
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3 gap-4">
      {exercises.map((exercise) => (
        <Card className="bg-slate-700 border-primary" key={exercise.id}>
          <CardHeader>
            <CardTitle className="text-white uppercase">
              {exercise.name}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {showDemo ? (
              <div>
                <Image
                  src={exercise.gifUrl}
                  alt={exercise.name}
                  width={500}
                  height={250}
                  className="rounded-md"
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

            <CardDescription className="text-white capitalize">
              <strong>Target:</strong> {exercise.target}
              <br />
              <strong>Equipment:</strong> {exercise.equipment}
              <br />
              <strong>Body Part:</strong> {exercise.bodyPart}
              <br />
            </CardDescription>
            <br />
            <a className="text-primary cursor-pointer">Add To Workout</a>
          </CardContent>
          <CardFooter className="capitalize text-white">
            <strong>Secondary Muscles:&nbsp;</strong>
            {exercise.secondaryMuscles.join(', ')}
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}

/*
{
    "bodyPart": "waist",
    "equipment": "body weight",
    "gifUrl": "https://v2.exercisedb.io/image/fshjon1EFAgj7i",
    "id": "0001",
    "name": "3/4 sit-up",
    "target": "abs",
    "secondaryMuscles": [
        "hip flexors",
        "lower back"
    ],
    "instructions": [
        "Lie flat on your back with your knees bent and feet flat on the ground.",
        "Place your hands behind your head with your elbows pointing outwards.",
        "Engaging your abs, slowly lift your upper body off the ground, curling forward until your torso is at a 45-degree angle.",
        "Pause for a moment at the top, then slowly lower your upper body back down to the starting position.",
        "Repeat for the desired number of repetitions."
    ]
}
*/
