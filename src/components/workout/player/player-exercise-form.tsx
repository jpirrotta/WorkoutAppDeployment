'use client';

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, useFieldArray } from 'react-hook-form';
import { Exercise, Set, playerFormSchema } from '@/types';
import {
  currentSetIndexAtom,
  exerciseStatesAtom,
  exerciseFormValuesAtom,
  isAllExercisesCompletedAtom,
} from '@/store';
import { useAtom, useSetAtom, useAtomValue } from 'jotai';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { flattenSets } from '@/components/workout/player';
import { useEffect } from 'react';

// Function to reconstruct the nested structure from the form to what the db expects
const reconstructSets = (
  setsFromForm: Array<{ reps: number; weight: number }>
): Set[] => {
  const groupedSets = setsFromForm.reduce((acc, curr) => {
    const key = `${curr.reps}-${curr.weight}`;
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return Object.entries(groupedSets).map(([key, count]) => {
    const [reps, weight] = key.split('-').map(Number);
    return {
      sets: count,
      reps,
      weight,
    };
  });
};

type ExerciseFormProps = {
  exercise: Exercise;
};

export default function PlayerExerciseForm({ exercise }: ExerciseFormProps) {
  const [currentSetIndex, setCurrentSetIndex] = useAtom(currentSetIndexAtom);
  const [exerciseStates, setExerciseStates] = useAtom(exerciseStatesAtom);
  const setExerciseFormValues = useSetAtom(exerciseFormValuesAtom);
  const isAllExercisesCompleted = useAtomValue(isAllExercisesCompletedAtom);

  // Flatten the sets
  const flatSets = flattenSets(exercise.sets);

  // Reconstruct the sets
  const playerForm = useForm<z.infer<typeof playerFormSchema>>({
    resolver: zodResolver(playerFormSchema),
    defaultValues: {
      sets: flatSets,
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: playerForm.control,
    name: 'sets',
  });

  useEffect(() => {
    if (isAllExercisesCompleted) {
      setExerciseFormValues((prev) => ({
        ...prev,
        [exercise.id]: reconstructSets(playerForm.getValues().sets),
      }));
    }
  }, [isAllExercisesCompleted, exercise.id, playerForm, setExerciseFormValues]);

  // this handles the styling of the set number based on if its completed or not
  const isCompletedStyle = (index: number) => {
    const exerciseState = exerciseStates[exercise.id];

    if (exerciseState?.completedSets[index] === true) {
      return 'border rounded-3xl border-primary bg-primary';
    } else if (exerciseState?.completedSets[index] === false) {
      return 'border rounded-3xl border-primary bg-muted';
    }
    return 'border rounded-3xl border-primary';
  };

  return (
      <Form {...playerForm}>
        <form>
          {fields.map((field, index) => (
            <div
              onClick={() => setCurrentSetIndex(index)}
              key={field.id}
              className={`flex flex-row justify-between p-2 pb-3 items-center ${
                currentSetIndex === index ? 'bg-background rounded-3xl' : ''
              }`}
            >
              <p className={` p-2 font-bold ${isCompletedStyle(index)}`}>
                {index + 1}
              </p>
              <FormField
                control={playerForm.control}
                name={`sets.${index}.reps`}
                render={() => (
                  <FormItem className="flex flex-row-reverse justify-center items-center gap-2">
                    <FormLabel>Reps</FormLabel>
                    <FormControl>
                      <Input
                        {...playerForm.register(`sets.${index}.reps`, {
                          valueAsNumber: true,
                        })}
                        type="number"
                        placeholder="reps"
                        className="w-full"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={playerForm.control}
                name={`sets.${index}.weight`}
                render={() => (
                  <FormItem className="flex flex-row-reverse justify-center items-center gap-2">
                    <FormLabel>Weight</FormLabel>
                    <FormControl>
                      <Input
                        {...playerForm.register(`sets.${index}.weight`, {
                          valueAsNumber: true,
                        })}
                        type="number"
                        placeholder="weight"
                        className="w-full"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
          ))}
          <div className="flex flex-col gap-1 pt-2">
            <Button
              variant="icon"
              onClick={(e) => {
                e.preventDefault();
                append({ reps: 1, weight: 0 });
                setExerciseStates((prev) => ({
                  ...prev,
                  [exercise.id]: {
                    ...prev[exercise.id],
                    numberOfSets: (prev[exercise.id]?.numberOfSets || 0) + 1, // Update numberOfSets
                    completedSets: [
                      ...(prev[exercise.id]?.completedSets || []),
                      undefined,
                    ],
                  },
                }));
              }}
              className="text-primary"
            >
              <Plus />
            </Button>

            <Button
              onClick={(e) => {
                e.preventDefault();
                if (fields.length === 1) return; // Prevent removing if no sets exist
                remove(fields.length - 1);
                setExerciseStates((prev) => ({
                  ...prev,
                  [exercise.id]: {
                    ...prev[exercise.id],
                    numberOfSets: prev[exercise.id]?.numberOfSets - 1, // Update numberOfSets
                    completedSets: prev[exercise.id]?.completedSets.slice(
                      0,
                      -1
                    ),
                  },
                }));
              }}
            >
              Remove Set
            </Button>
          </div>
        </form>
      </Form>
  );
}
