'use client';

import * as React from 'react';
import * as ProgressPrimitive from '@radix-ui/react-progress';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useAtom, useSetAtom } from 'jotai';
import { carouselApiAtom, selectedStepAtom } from '@/store';
import { Check } from 'lucide-react';

interface WorkoutProgressProps
  extends React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root> {
  steps: number;
  completedSteps: number[];
}

const WorkoutProgress = React.forwardRef<
  React.ElementRef<typeof ProgressPrimitive.Root>,
  WorkoutProgressProps
>(({ className, value, completedSteps, steps, ...props }, ref) => {
  const [selectedStep, setSelectedStep] = useAtom(selectedStepAtom);
  const setApi = useSetAtom(carouselApiAtom);

  const handleClick = (index: number) => {
    setSelectedStep(index);
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
            variant={selectedStep === index ? 'default' : 'secondary'}
            key={index}
            onClick={() => handleClick(index)}
            className="rounded-full"
            size="icon"
          >
            {completedSteps.includes(index) ? <Check /> : index + 1}
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
