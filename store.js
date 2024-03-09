import { atom } from 'jotai';

const measurementAtom = atom('numerical');

const profileDataAtom = atom(undefined);

export { profileDataAtom, measurementAtom };
