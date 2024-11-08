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
import { Exercise, Set, playerFormSchema, FlatSets, Workout } from '@/types';
import { currentSetIndexAtom, exerciseStatesAtom } from '@/store';
import { useAtom } from 'jotai';
import { useEffect, useMemo, useState } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { set } from 'lodash';

type ExerciseFormProps = {
  exercise: Exercise;
};

export default function PlayerExerciseForm({ exercise }: ExerciseFormProps) {
  const [currentSetIndex, setCurrentSetIndex] = useAtom(currentSetIndexAtom);
  const [exerciseStates, setExerciseStates] = useAtom(exerciseStatesAtom);
  const [isCompleted, setIsCompleted] = useState(false);
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

  const isAllExercisesCompleted = useMemo(() => {
    if (!exerciseStates[exercise.id]) return false;
    return Object.values(exerciseStates).every((exerciseState) => {
      return (
        exerciseState.numberOfSets ===
        exerciseState.completedSets.filter((set) => set !== undefined).length
      );
    });
  }, [exerciseStates]);

  useEffect(() => {
    if (isAllExercisesCompleted && !isCompleted) {
      setIsCompleted(true);
    }
  }, [isAllExercisesCompleted]);

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

  function onSubmit(values: z.infer<typeof playerFormSchema>) {
    console.log('values', values);
    const newValues = reconstructSets(values.sets);
    console.log('new values', newValues);
    setIsCompleted(false);
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
                  completedSets: prev[exercise.id]?.completedSets.slice(0, -1),
                },
              }));
            }}
          >
            Remove Set
          </Button>
        </div>
        <AlertDialog open={isCompleted} onOpenChange={setIsCompleted}>
          {/* <AlertDialogTrigger value={"fdsf"} />
            {/* Save Workout */}
          {/* </AlertDialogTrigger> */}
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                Mazal Tov 🎉 you have completed your workout{' '}
              </AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete your
                account and remove your data from our servers.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                type="submit"
                onClick={() => {
                  onSubmit(playerForm.getValues());
                }}
              >
                Save Workout
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </form>
    </Form>
  );
}
