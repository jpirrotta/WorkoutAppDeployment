import { atom } from 'jotai';

const measurementAtom = atom('numerical');

const profileDataAtom = atom(undefined);

const limitAtom = atom(6);

export { profileDataAtom, measurementAtom, limitAtom };
