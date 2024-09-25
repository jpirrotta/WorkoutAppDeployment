import { useAtom, useAtomValue } from 'jotai';
import { useEffect } from 'react';
import { workoutStopWatchAtom, isPlayingAtom } from '@/store'; // Adjust the import path as needed

export default function Stopwatch() {
  const [stopwatch, setStopwatch] = useAtom(workoutStopWatchAtom);
  const isPlaying = useAtomValue(isPlayingAtom);

  useEffect(() => {
    let interval: NodeJS.Timeout | undefined;

    if (isPlaying) {
      interval = setInterval(() => {
        setStopwatch((prev) => prev + 1);
      }, 1000);
    } else if (interval) {
      clearInterval(interval);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isPlaying, setStopwatch]);

  // Format the stopwatch value as HH:MM:SS
  const formatTime = (time: number) => {
    const hours = String(Math.floor(time / 3600)).padStart(2, '0');
    const minutes = String(Math.floor((time % 3600) / 60)).padStart(2, '0');
    const seconds = String(time % 60).padStart(2, '0');
    return `${hours}:${minutes}:${seconds}`;
  };

  return (
    <div
      className={`flex flex-col items-center justify-center ${
        isPlaying && 'animate-pulse'
      }`}
    >
      <div className="ring-primary">
        <h1 className="text-2xl text-primary font-bold text-center">
          {formatTime(stopwatch)}
        </h1>
      </div>
    </div>
  );
}
