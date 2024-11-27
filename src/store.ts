import { atom } from 'jotai';
import { type BMI, type User, type Exercise, type Sets } from '@/types';
import { atomWithStorage } from 'jotai/utils';
import { type CarouselApi } from './components/ui/carousel';
import { z } from 'zod';

export const measurementAtom = atom<'metric' | 'imperial'>('metric');

export const userAtom = atom<User | undefined>();

export const userBMI = atom<BMI | undefined>();

export const limitAtom = atom<number>(6);

export const sidebarToggleAtom = atomWithStorage('sidebarToggle', true);

// atoms for the workout player ( consider moving this to a separate store )
// this will hold the current played workout which will be used
// to see if theres a workout playing or not ( can be useful for the notification )
export const selectedWorkoutAtom = atom<string | undefined>(); // not used at the moment

// this will hold the current step of the workout (eg exercise 1, exercise 2)
export const currentExerciseIndexAtom = atom<number>(0);

export const completedExerciseAtom = atom<number[]>([]);

export const currentSetIndexAtom = atom<number>(0);

// essentially a map of exercise id to the state of the exercise (completed sets) for the player
export const exerciseStatesAtom = atom<{
  [exerciseId: string]: {
    numberOfSets: number;
    completedSets: (boolean | undefined)[];
  };
}>({});

export const exerciseFormValuesAtom = atom<Record<string, Sets>>({});

export const totalExercisesAtom = atom<number>(0);

export const carouselApiAtom = atom<CarouselApi>();

export const isPlayingAtom = atom<boolean>(false);

export const workoutDurationAtom = atom<number>(0);

export const isAllExercisesCompletedAtom = atom((get) => {
  const exerciseStates = get(exerciseStatesAtom);

  // Return false if no states exist
  if (Object.keys(exerciseStates).length === 0) return false;

  return Object.values(exerciseStates).every(
    (exerciseState) =>
      exerciseState.numberOfSets ===
      exerciseState.completedSets.filter((set) => set !== undefined).length
  );
});

export const resetPlayerAtoms = atom(null, (_get, set) => {
  set(currentExerciseIndexAtom, 0);
  set(completedExerciseAtom, []);
  set(currentSetIndexAtom, 0);
  set(exerciseStatesAtom, {});
  set(exerciseFormValuesAtom, {});
  set(totalExercisesAtom, 0);
  set(carouselApiAtom, undefined);
  set(isPlayingAtom, false);
  set(workoutDurationAtom, 0);
});

// end of player atoms

// Used in Social Feed for number of posts to render per load
export const pageAtom = atom<number>(1);
export const itemsPerPageAtom = atom<number>(10);

// create workout from selected exercises atom
export const selectedExercisesAtom = atom<Exercise[]>([]);

// selected workout index
export const selectedWorkoutIndexAtom = atom<number | null>(0);

export const setsMissingExerciseAtom = atom<string[] | null>(null);