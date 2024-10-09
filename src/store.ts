import { atom } from 'jotai';
import { BMI, User, Exercise } from '@/types';
import { atomWithStorage } from 'jotai/utils';

export const measurementAtom = atom<'metric' | 'imperial'>('metric');

export const userAtom = atom<User | undefined>();

export const userBMI = atom<BMI | undefined>();

export const limitAtom = atom<number>(6);

export const sidebarToggleAtom = atomWithStorage('sidebarToggle', true);

// Used in Social Feed for number of posts to render per load
export const pageAtom = atom<number>(1);
export const itemsPerPageAtom = atom<number>(10);

// create workout from selected exercises atom
export const selectedExercisesAtom = atom<Exercise[]>([]);