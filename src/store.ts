import { atom } from 'jotai';
import { BMI, User } from '@/types';

export const measurementAtom = atom<'metric' | 'imperial'>('metric');

export const profileDataAtom = atom<User | undefined>();

export const userBMI = atom<BMI | undefined>();

export const limitAtom = atom<number>(6);
