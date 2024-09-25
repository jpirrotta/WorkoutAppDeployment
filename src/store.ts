import { atom } from 'jotai';
import { BMI, User } from '@/types';
import { atomWithStorage } from 'jotai/utils';
import { type CarouselApi } from './components/ui/carousel';

export const measurementAtom = atom<'metric' | 'imperial'>('metric');

export const userAtom = atom<User | undefined>();

export const userBMI = atom<BMI | undefined>();

export const limitAtom = atom<number>(6);

export const sidebarToggleAtom = atomWithStorage('sidebarToggle', true);

// atoms for the workout player ( consider moving this to a separate store file )

// this will hold the current played workout which will be used
// to see if theres a workout playing or not ( can be useful for the notification )
export const selectedWorkoutAtom = atom<string | undefined>();

// this will hold the current step of the workout (eg exercise 1, exercise 2)
export const selectedStepAtom = atom<number>(0);

export const totalStepsAtom = atom<number>(0);

export const completedStepsAtom = atom<number[]>([]);

export const carouselApiAtom = atom<CarouselApi>();

export const workoutStopWatchAtom = atom<number>(0);

export const isPlayingAtom = atom<boolean>(false);
