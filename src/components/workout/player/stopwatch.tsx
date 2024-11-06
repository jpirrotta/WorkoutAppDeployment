import { useAtom, useAtomValue } from 'jotai';
import { useEffect, useState } from 'react';
import {
  isPlayingAtom,
  totalExercisesAtom,
  completedExerciseAtom,
} from '@/store'; // Adjust the import path as needed

export default function Stopwatch() {
  const [stopwatch, setStopwatch] = useState(0);
  const totalSteps = useAtomValue(totalExercisesAtom);
  const completedExercise = useAtomValue(completedExerciseAtom);
  const [isPlaying, setIsPlaying] = useAtom(isPlayingAtom);

  console.log('totalSteps', totalSteps);
  console.log('completedExercise', completedExercise);
  console.log('completedExercise.length', completedExercise.length);
  console.log('isPlaying', isPlaying);

  useEffect(() => {
    let interval: NodeJS.Timeout | undefined;

    if (isPlaying && !(completedExercise.length === totalSteps)) {
      interval = setInterval(() => {
        setStopwatch((prev) => prev + 1);
      }, 1000);
    } else if (interval) {
      setIsPlaying(false);
      clearInterval(interval);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isPlaying, setIsPlaying, setStopwatch, completedExercise, totalSteps]);

  // Format the stopwatch value as HH:MM:SS
  const formatTime = (time: number) => {
    const hours = String(Math.floor(time / 3600)).padStart(2, '0');
    const minutes = String(Math.floor((time % 3600) / 60)).padStart(2, '0');
    const seconds = String(time % 60).padStart(2, '0');
    return `${hours}:${minutes}:${seconds}`;
  };

  return (
    <div
      className={`flex flex-col items-center justify-center ${
        isPlaying && 'animate-pulse'
      }`}
    >
      <div className="ring-primary">
        <h1 className="text-2xl text-primary font-bold text-center">
          {formatTime(stopwatch)}
        </h1>
      </div>
    </div>
  );
}
