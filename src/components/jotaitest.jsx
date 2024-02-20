'use client';

import { useAtom } from 'jotai';
import { messageAtom } from '../../store';

export default function JotaiTest() {
  const [message, setMessage] = useAtom(messageAtom);

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <h1>{message}</h1>
    </main>
  );
  ``;
}
