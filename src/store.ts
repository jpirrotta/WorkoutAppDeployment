import { atom } from 'jotai';
import { BMI, User } from '@/types';
import { atomWithStorage } from 'jotai/utils';

export const measurementAtom = atom<'metric' | 'imperial'>('metric');

export const userAtom = atom<User | undefined>();

export const userBMI = atom<BMI | undefined>();

export const limitAtom = atom<number>(6);

export const sidebarToggleAtom = atomWithStorage('sidebarToggle', true);
