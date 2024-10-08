'use client';

import { Button } from '@/components/ui/button';
import {
  selectedStepAtom,
  completedStepsAtom,
  carouselApiAtom,
  isPlayingAtom,
  totalStepsAtom,
} from '@/store';
import { useAtom, useSetAtom } from 'jotai';
import { Play, StepBack, StepForward, Check, X, Pause } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function WorkoutPlayerCommandMenu() {
  const [totalSteps, setTotalSteps] = useAtom(totalStepsAtom);

  const [selectedStep, setSelectedStep] = useAtom(selectedStepAtom);
  const [completedSteps, setCompletedSteps] = useAtom(completedStepsAtom);
  const setApi = useSetAtom(carouselApiAtom);
  const [isPlaying, setIsPlaying] = useAtom(isPlayingAtom);
  const [animatingButton, setAnimatingButton] = useState<string | null>(null);

  const handleClick = (buttonName: string, callback: () => void) => {
    if (animatingButton) {
      return;
    }
    setAnimatingButton(buttonName);
    callback();
  };

  const removeCompletedStep = () => {
    setCompletedSteps((prev) => prev.filter((step) => step !== selectedStep));
  };

  const addStep = () => {
    setCompletedSteps((prev) => [...prev, selectedStep]);
    nextStep();
  };

  const playPause = () => {
    setIsPlaying((prev) => !prev);
  };

  const nextStep = () => {
    setApi((prev) => {
      const newIndex = (selectedStep + 1) % totalSteps;
      prev?.scrollTo(newIndex);
      return prev;
    });
    setSelectedStep((prev) => (prev + 1) % totalSteps);
  };

  const prevStep = () => {
    setApi((prev) => {
      const newIndex = (selectedStep - 1 + totalSteps) % totalSteps;
      prev?.scrollTo(newIndex);
      return prev;
    });
    setSelectedStep((prev) => (prev - 1 + totalSteps) % totalSteps);
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
      <Button
        disabled={!completedSteps.includes(selectedStep)}
        onClick={() => handleClick('remove', removeCompletedStep)}
      >
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
        disabled={completedSteps.includes(selectedStep)}
        onClick={() => handleClick('add', addStep)}
      >
        <Check
          className={animatingButton === 'add' ? 'animate-grow-shrink' : ''}
        />
      </Button>
    </menu>
  );
}
