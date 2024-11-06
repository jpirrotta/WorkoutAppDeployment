'use client';

import { Button } from '@/components/ui/button';
import {
  currentExerciseIndexAtom,
  currentSetIndexAtom,
  completedExerciseAtom,
  carouselApiAtom,
  isPlayingAtom,
  totalExercisesAtom,
  numberOfSetsAtom,
  completedSetsAtom,
} from '@/store';
import { useAtom, useSetAtom, useAtomValue } from 'jotai';
import { Play, StepBack, StepForward, Check, X, Pause } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Exercise } from '@/types';

type WorkoutPlayerCommandMenuProps = {
  exercises?: Exercise[];
};

export default function WorkoutPlayerCommandMenu({
  exercises,
}: WorkoutPlayerCommandMenuProps) {
  const [totalSteps, setTotalSteps] = useAtom(totalExercisesAtom);

  const [currentExerciseIndex, setCurrentExerciseIndex] = useAtom(
    currentExerciseIndexAtom
  );
  const [completedExercise, setCompletedExercise] = useAtom(
    completedExerciseAtom
  );
  const [currentSetIndex, setCurrentSetIndex] = useAtom(currentSetIndexAtom);
  const setApi = useSetAtom(carouselApiAtom);
  const [isPlaying, setIsPlaying] = useAtom(isPlayingAtom);
  const numberOfSets = useAtomValue(numberOfSetsAtom);
  const [completedSets, setCompletedSets] = useAtom(completedSetsAtom);
  const [animatingButton, setAnimatingButton] = useState<string | null>(null);

  const handleClick = (buttonName: string, callback: () => void) => {
    if (animatingButton) {
      return;
    }
    setAnimatingButton(buttonName);
    callback();
  };

  const removeCompletedStep = () => {
    if (currentSetIndex >= 0 && currentSetIndex < numberOfSets - 1) {
      setCurrentSetIndex((prev) => prev + 1);
      setCompletedSets((prev) => {
        const updated = [...prev];
        updated[currentSetIndex] = false;
        return updated;
      });
      return;
    }
    setCurrentSetIndex((prev) => prev + 1);
    setCompletedSets((prev) => {
      const updated = [...prev];
      updated[currentSetIndex] = false;
      return updated;
    });
    setCompletedExercise((prev) => [...prev, currentExerciseIndex]);

    setCurrentSetIndex(0);
    nextStep();
  };

  const addStep = () => {
    if (currentSetIndex < numberOfSets - 1) {
      setCurrentSetIndex((prev) => prev + 1);
      setCompletedSets((prev) => {
        const updated = [...prev];
        updated[currentSetIndex] = true;
        return updated;
      });
      return;
    }
    setCurrentSetIndex((prev) => prev + 1);
    setCompletedSets((prev) => {
      const updated = [...prev];
      updated[currentSetIndex] = true;
      return updated;
    });
    setCompletedExercise((prev) => [...prev, currentExerciseIndex]);
    setCurrentSetIndex(0);
    nextStep();
  };

  const playPause = () => {
    setIsPlaying((prev) => !prev);
  };

  const nextStep = () => {
    setApi((prev) => {
      const newIndex = (currentExerciseIndex + 1) % totalSteps;
      prev?.scrollTo(newIndex);
      return prev;
    });

    setCurrentExerciseIndex((prev) => (prev + 1) % totalSteps);
  };

  const prevStep = () => {
    setApi((prev) => {
      const newIndex = (currentExerciseIndex - 1 + totalSteps) % totalSteps;
      prev?.scrollTo(newIndex);
      return prev;
    });

    if (currentSetIndex > 0) {
      setCurrentSetIndex((prev) => prev - 1);
      return;
    }

    setCurrentExerciseIndex((prev) => (prev - 1 + totalSteps) % totalSteps);
    return;
  };

  useEffect(() => {
    if (animatingButton) {
      const timer = setTimeout(() => {
        setAnimatingButton(null);
      }, 500); // Match the duration of the grow-shrink animation in global.css
      return () => clearTimeout(timer);
    }
  }, [animatingButton]);

  return (
    <menu className="flex flex-row gap-2 sm:gap-6 h-14 border-primary">
      <Button onClick={() => handleClick('remove', removeCompletedStep)}>
        <X
          className={animatingButton === 'remove' ? 'animate-grow-shrink' : ''}
        />
      </Button>

      <Button onClick={() => handleClick('prev', prevStep)}>
        <StepBack
          className={animatingButton === 'prev' ? 'animate-grow-shrink' : ''}
        />
      </Button>

      <Button onClick={() => handleClick('playPause', playPause)}>
        {isPlaying ? (
          <Pause
            className={
              animatingButton === 'playPause' ? 'animate-spin-slow' : ''
            }
          />
        ) : (
          <Play
            className={
              animatingButton === 'playPause' ? 'animate-spin-slow' : ''
            }
          />
        )}
      </Button>

      <Button onClick={() => handleClick('next', nextStep)}>
        <StepForward
          className={animatingButton === 'next' ? 'animate-grow-shrink' : ''}
        />
      </Button>

      <Button
        disabled={completedExercise.includes(currentExerciseIndex)}
        onClick={() => handleClick('add', addStep)}
      >
        <Check
          className={animatingButton === 'add' ? 'animate-grow-shrink' : ''}
        />
      </Button>
    </menu>
  );
}
