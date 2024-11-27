'use client';
import {
  Timeline,
  TimelineItem,
  TimelineTitle,
  TimelineDescription,
  TimelineTime,
  TimelineHeader,
} from '@/components/ui/timeline';
import useInsights from '@/hooks/insights/useInsights';
import TimelineStamp from './timelineStamp';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';

export default function WorkoutTimeline() {
  const { data: userInsights } = useInsights();

  return (
    <ScrollArea className="w-full mb-5 whitespace-nowrap rounded-md border">
      {userInsights?.workoutHistory && (userInsights.workoutHistory.length > 0) ? (
        <Timeline horizontal className="py-10">
          {userInsights.workoutHistory
            ?.slice()
            .reverse()
            .map((workout, index) => (
              <TimelineItem key={`${index}`} className="mx-10">
                <TimelineHeader>
                  <TimelineTime className="font-bold text-base">
                    {new Date(workout.date).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                    })}
                  </TimelineTime>
                </TimelineHeader>
                <TimelineDescription>
                  <TimelineStamp workout={workout} />
                </TimelineDescription>
              </TimelineItem>
            ))}
        </Timeline>
      ) : (
        <div id="no-data" className="flex w-full items-center justify-center">
          <p className="text-lg">Workout to see your workout timeline here</p>
        </div>
      )}
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  );
}
