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
import { Exercise, Set, playerFormSchema, FlatSets } from '@/types';
import { currentSetIndexAtom, exerciseStatesAtom } from '@/store';
import { useAtom, useSetAtom, useAtomValue } from 'jotai';
import { useEffect } from 'react';
type ExerciseFormProps = {
  exercise: Exercise;
};

export default function PlayerExerciseForm({ exercise }: ExerciseFormProps) {
  const [currentSetIndex, setCurrentSetIndex] = useAtom(currentSetIndexAtom);
  const [exerciseStates, setExerciseStates] = useAtom(exerciseStatesAtom);

  // Initialize exercise state if not exists
  useEffect(() => {
    if (!exerciseStates[exercise.id]) {
      const flatSets = flattenSets(exercise.sets);
      setExerciseStates((prev) => ({
        ...prev,
        [exercise.id]: {
          numberOfSets: flatSets.length,
          completedSets: new Array(flatSets.length).fill(undefined),
        },
      }));
    }
  }, [exercise.id, exercise.sets, exerciseStates, setExerciseStates]);

  const exerciseState = exerciseStates[exercise.id];

  // Function to flatten the nested sets structure
  const flattenSets = (nestedSets: Set[]): FlatSets => {
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
  const reconstructSets = (flatSets: FlatSets): Set[] => {
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

  console.log('exercise', exercise);

  // Flatten the sets
  const flatSets = flattenSets(exercise.sets);
  console.log('flatSets', flatSets);

  // Reconstruct the sets
  const playerForm = useForm<z.infer<typeof playerFormSchema>>({
    resolver: zodResolver(playerFormSchema),
    defaultValues: {
      sets: flatSets,
    },
  });

  const { fields, append, remove, update } = useFieldArray({
    control: playerForm.control,
    name: 'sets',
  });

  function onSubmit(values: z.infer<typeof playerFormSchema>) {
    console.log('values', values);
    const newValues = reconstructSets(values.sets);
    console.log('new values', newValues);
  }

  // this handles the styling of the set number based on if its completed or not
  const isCompletedStyle = (index: number) => {
    if (exerciseState?.completedSets[index] === true) {
      return 'border rounded-3xl border-primary bg-primary';
    } else if (exerciseState?.completedSets[index] === false) {
      return 'border rounded-3xl border-primary bg-muted';
    }
    return 'border rounded-3xl border-primary';
  };

  return (
    <Form {...playerForm}>
      <form onSubmit={playerForm.handleSubmit(onSubmit)}>
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
              render={({ field }) => (
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
                      min={1}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={playerForm.control}
              name={`sets.${index}.weight`}
              render={({ field }) => (
                <FormItem className="flex flex-row-reverse justify-center items-center gap-2">
                  <FormLabel>weight</FormLabel>
                  <FormControl>
                    <Input
                      {...playerForm.register(`sets.${index}.weight`, {
                        valueAsNumber: true,
                      })}
                      type="number"
                      placeholder="weight"
                      className="w-full"
                      min={1}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
        ))}
        <div className="flex flex-col gap-2">
          <button
            type="button"
            onClick={() => {
              append({ reps: 0, weight: 0 });
            }}
          >
            Add Set
          </button>
        </div>
        <button type="submit">Submit</button>
      </form>
    </Form>
  );
}
