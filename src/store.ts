import { atom } from 'jotai';
import { BMI } from '@/types';

export const measurementAtom = atom<string>('metric');

// TODO - Add Type to the user atom
export const profileDataAtom = atom<any>(undefined);

export const userBMI = atom<BMI | undefined>(undefined);

export const limitAtom = atom<number>(6);
