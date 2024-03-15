import { atom } from 'jotai';

const measurementAtom = atom('metric');

const profileDataAtom = atom(undefined);

const limitAtom = atom(6);

export { profileDataAtom, measurementAtom, limitAtom };
