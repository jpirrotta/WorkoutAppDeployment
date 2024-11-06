'use client';

import * as React from 'react';
import * as ProgressPrimitive from '@radix-ui/react-progress';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useAtom, useSetAtom, useAtomValue } from 'jotai';
import {
  carouselApiAtom,
  currentExerciseIndexAtom,
  completedExerciseAtom,
  currentSetIndexAtom,
} from '@/store';
import { Check } from 'lucide-react';

interface WorkoutProgressProps
  extends React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root> {
  steps: number;
}

const WorkoutProgress = React.forwardRef<
  React.ElementRef<typeof ProgressPrimitive.Root>,
  WorkoutProgressProps
>(({ className, value, steps, ...props }, ref) => {
  const [currentExerciseIndex, SetCurrentExerciseIndex] = useAtom(
    currentExerciseIndexAtom
  );
  const completedExercise = useAtomValue(completedExerciseAtom);
  const setCurrentSetIndex = useSetAtom(currentSetIndexAtom);

  const setApi = useSetAtom(carouselApiAtom);

  const handleClick = (index: number) => {
    setCurrentSetIndex(0);
    SetCurrentExerciseIndex(index);
    setApi((prev) => {
      prev?.scrollTo(index);
      return prev;
    });
  };

  return (
    <ProgressPrimitive.Root
      ref={ref}
      className={cn(
        'relative h-fit w-full overflow-hidden rounded-full bg-secondary',
        className
      )}
      {...props}
    >
      <div className="flex flex-row justify-between">
        {Array.from({ length: steps }).map((_, index) => (
          <Button
            variant={currentExerciseIndex === index ? 'default' : 'secondary'}
            key={index}
            onClick={() => handleClick(index)}
            className="rounded-full"
            size="icon"
          >
            {completedExercise.includes(index) ? <Check /> : index + 1}
          </Button>
        ))}
      </div>

      <ProgressPrimitive.Indicator
        className="h-full w-full flex-1 bg-primary transition-all"
        style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
      />
    </ProgressPrimitive.Root>
  );
});

WorkoutProgress.displayName = ProgressPrimitive.Root.displayName;

export { WorkoutProgress };
