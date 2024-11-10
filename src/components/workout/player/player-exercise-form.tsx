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
import { Exercise, Sets, playerFormSchema, FlatSets } from '@/types';
import {
  currentSetIndexAtom,
  exerciseFormValuesAtom,
  exerciseStatesAtom,
  isAllExercisesCompletedAtom,
} from '@/store';
import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import { useEffect } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

type ExerciseFormProps = {
  exercise: Exercise;
};

// Function to flatten the nested sets structure
const flattenSets = (nestedSets: Sets): FlatSets => {
  const flatSets: FlatSets = [];

  nestedSets.forEach((set) => {
    // Repeat for the number of sets
    for (let i = 0; i < set.sets; i++) {
      flatSets.push({
        reps: set.reps,
        weight: set.weight,
      });
    }
  });

  return flatSets;
};

// Function to reconstruct the nested structure
const reconstructSets = (flatSets: FlatSets): Sets => {
  const groupedSets = flatSets.reduce((acc, curr) => {
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
        [exercise._id!.toString()]: reconstructSets(
          playerForm.getValues().sets
        ),
      }));
    }
  }, [
    isAllExercisesCompleted,
    exercise._id,
    playerForm,
    setExerciseFormValues,
  ]);

  // this handles the styling of the set number based on if its completed or not
  const isCompletedStyle = (index: number) => {
    const exerciseState = exerciseStates[exercise._id!.toString()];

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
                [exercise._id!.toString()]: {
                  ...prev[exercise._id!.toString()],
                  numberOfSets: (prev[exercise._id!.toString()]?.numberOfSets || 0) + 1, // Update numberOfSets
                  completedSets: [
                    ...(prev[exercise._id!.toString()]?.completedSets || []),
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
                [exercise._id!.toString()]: {
                  ...prev[exercise._id!.toString()],
                  numberOfSets: prev[exercise._id!.toString()]?.numberOfSets - 1, // Update numberOfSets
                  completedSets: prev[exercise._id!.toString()]?.completedSets.slice(0, -1),
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
