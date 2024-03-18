import { atom } from 'jotai';

const measurementAtom = atom('metric');

const profileDataAtom = atom(undefined);

const userBMI = atom(0);

const limitAtom = atom(6);

export { profileDataAtom, measurementAtom, limitAtom, userBMI };
