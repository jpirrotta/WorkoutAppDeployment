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
import {
  currentExerciseIndexAtom,
  numberOfSetsAtom,
  currentSetIndexAtom,
  completedSetsAtom,
} from '@/store';
import { useAtom, useSetAtom, useAtomValue } from 'jotai';
type ExerciseFormProps = {
  exercise: Exercise;
};

export default function PlayerExerciseForm({ exercise }: ExerciseFormProps) {
  const [currentExerciseIndex, setCurrentExerciseIndex] = useAtom(
    currentExerciseIndexAtom
  );
  const setNumberOfSets = useSetAtom(numberOfSetsAtom);
  const currentSetIndex = useAtomValue(currentSetIndexAtom);
  const completedSets = useAtomValue(completedSetsAtom);

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
  setNumberOfSets(flatSets.length);

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

  return (
    <Form {...playerForm}>
      <form onSubmit={playerForm.handleSubmit(onSubmit)}>
        {fields.map((field, index) => (
          <div
            key={field.id}
            className={`flex flex-row justify-between pb-2 ${
              currentSetIndex === index ? 'bg-background' : ''
            }`}
          >
            <p>
              {index + 1} {completedSets.at(index) === true && '✅'}{' '}
              {completedSets.at(index) === false && '❌'}
            </p>
            <FormField
              control={playerForm.control}
              name={`sets.${index}.reps`}
              render={({ field }) => (
                <FormItem>
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
                <FormItem>
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
