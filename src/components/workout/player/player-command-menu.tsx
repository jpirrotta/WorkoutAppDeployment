'use client';

import { Button } from '@/components/ui/button';
import {
  currentExerciseIndexAtom,
  currentSetIndexAtom,
  completedExerciseAtom,
  carouselApiAtom,
  isPlayingAtom,
  totalExercisesAtom,
  exerciseStatesAtom,
} from '@/store';
import { useAtom, useSetAtom, useAtomValue } from 'jotai';
import { Play, StepBack, StepForward, Check, X, Pause } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { Exercise } from '@/types';

type WorkoutPlayerCommandMenuProps = {
  exercises: Exercise[];
};

export default function WorkoutPlayerCommandMenu({
  exercises,
}: WorkoutPlayerCommandMenuProps) {
  const [isPlaying, setIsPlaying] = useAtom(isPlayingAtom);
  const [exerciseStates, setExerciseStates] = useAtom(exerciseStatesAtom);
  const [currentSetIndex, setCurrentSetIndex] = useAtom(currentSetIndexAtom);
  const currentExerciseIndex = useAtomValue(currentExerciseIndexAtom);
  const totalSteps = useAtomValue(totalExercisesAtom);
  const [completedExercise, setCompletedExercise] = useAtom(
    completedExerciseAtom
  );
  const setApi = useSetAtom(carouselApiAtom);
  const [animatingButton, setAnimatingButton] = useState<string | null>(null);
  const [isCompleted, setIsCompleted] = useState(false);

  const currentExercise = exercises[currentExerciseIndex];
  const currentExerciseState = currentExercise
    ? exerciseStates[currentExercise.id]
    : null;

  const areAllExercisesMarked = useCallback(() => {
    if (!currentExercise || !currentExerciseState) return false;
    return exercises.every((exercise) => {
      const exerciseState = exerciseStates[exercise.id];
      if (!exerciseState) return false;
      return exerciseState.completedSets.every((set) => set !== undefined);
    });
  }, [exerciseStates, exercises, currentExercise, currentExerciseState]);

  const goToNextIncompleteExercise = useCallback(() => {
    let nextExerciseIndex = -1;
    let nextSetIndex = -1;

    for (let i = 0; i < exercises.length; i++) {
      const exercise = exercises[i];
      const exerciseState = exerciseStates[exercise.id];
      if (!exerciseState) continue;

      const setIndex = exerciseState.completedSets.findIndex(
        (set) => set === undefined
      );
      if (setIndex !== -1) {
        nextExerciseIndex = i;
        nextSetIndex = setIndex;
        break;
      }
    }

    if (nextExerciseIndex !== -1 && nextSetIndex !== -1) {
      setApi((prev) => {
        prev?.scrollTo(nextExerciseIndex);
        return prev;
      });
      setCurrentSetIndex(nextSetIndex);
    }
  }, [exercises, exerciseStates, setApi, setCurrentSetIndex]);

  // Effect to handle individual exercise completion
  useEffect(() => {
    exercises.forEach((exercise, index) => {
      const exerciseState = exerciseStates[exercise.id];
      if (
        exerciseState &&
        exerciseState.completedSets.every((set) => set !== undefined) &&
        !completedExercise.includes(index)
      ) {
        setCompletedExercise((prev) => [...prev, index]);
        goToNextIncompleteExercise();
      }
    });
  }, [
    exerciseStates,
    exercises,
    completedExercise,
    setCompletedExercise,
    goToNextIncompleteExercise,
  ]);

  useEffect(() => {
    if (areAllExercisesMarked()) {
      setIsCompleted(true);
      alert('Workout completed!');
      // TODO Add a modal that will ask the user if they want to save the workout.
      // TODO if there were any changes made to the workout add a toggle that will update the workout
    } else {
      setIsCompleted(false);
    }
  }, [exerciseStates, exercises, areAllExercisesMarked]);

  const handleClick = (buttonName: string, callback: () => void) => {
    if (animatingButton) {
      return;
    }
    setAnimatingButton(buttonName);
    callback();
  };

  const removeCompletedStep = () => {
    if (!currentExercise || !currentExerciseState) return;

    // Mark the current set as skipped
    setExerciseStates((prev) => ({
      ...prev,
      [currentExercise.id]: {
        ...prev[currentExercise.id],
        completedSets: prev[currentExercise.id].completedSets.map((set, i) =>
          i === currentSetIndex ? false : set
        ),
      },
    }));

    if (currentSetIndex < currentExerciseState.numberOfSets - 1) {
      setCurrentSetIndex((prev) => prev + 1);
    } else {
      goToNextIncompleteExercise();
      // setCurrentSetIndex(0);
      // Navigation is handled by useEffect when the exercise is marked as completed
    }
  };

  const addStep = () => {
    if (!currentExercise || !currentExerciseState) return;

    // Mark the current set as completed
    setExerciseStates((prev) => ({
      ...prev,
      [currentExercise.id]: {
        ...prev[currentExercise.id],
        completedSets: prev[currentExercise.id].completedSets.map((set, i) =>
          i === currentSetIndex ? true : set
        ),
      },
    }));

    if (currentSetIndex < currentExerciseState.numberOfSets - 1) {
      setCurrentSetIndex((prev) => prev + 1);
    } else {
      // setCurrentSetIndex(0);
      goToNextIncompleteExercise();
      // Navigation is handled by useEffect when the exercise is marked as completed
    }
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
    setCurrentSetIndex(0);
    return;
  };

  const prevStep = () => {
    setApi((prev) => {
      const newIndex = (currentExerciseIndex - 1 + totalSteps) % totalSteps;
      prev?.scrollTo(newIndex);
      return prev;
    });
    setCurrentSetIndex(0);
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

      <Button onClick={() => handleClick('add', addStep)}>
        <Check
          className={animatingButton === 'add' ? 'animate-grow-shrink' : ''}
        />
      </Button>
    </menu>
  );
}
