'use client';

import { Workout } from '@/types';
import { Label, LabelList, LineChart } from 'recharts';
import { useGetAllWorkouts } from '@/hooks/workout/useWorkoutQueries';
import { DownloadsChartConfig } from '@/components/dashboard-charts/config';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';

export default function SocialDownloadsChart() {
  const { data: userWorkouts } = useGetAllWorkouts();

  const extractDownloadsAcrossTime = () => {
    const savesData: {userId: String, date: Date}[] = [];

    userWorkouts?.forEach((workout: Workout) => {
      if (workout.saves.length > 0) {
        console.log("Downloads inside workout *", workout.name, "* - ", workout.saves);
        savesData.push(...workout.saves);
      }
    });

    console.log("Total Downloads: ", savesData);
    return savesData;
  };
  const savesData = extractDownloadsAcrossTime();






  return (
    <Card className="flex flex-col w-full">
      {savesData && (savesData.length > 0) ? (
        <>
          <CardHeader className="items-center pb-0">
            <CardTitle>Downloads Activity Timeline</CardTitle>
            <CardDescription></CardDescription>
          </CardHeader>
          <CardContent className="flex-1">
            <ChartContainer
              config={DownloadsChartConfig}
              className="mx-auto aspect-square max-h-[40rem] pb-0"
            >
              <>empty for now (add line graph)</>
            </ChartContainer>
          </CardContent>
          <CardFooter className="flex-col gap-2 text-sm">
            <div className="leading-none text-muted-foreground text-center">
              Showing total number of downloads across all workouts your have published
            </div>
          </CardFooter>
        </>
      ) : (
        <div id="no-data" className="flex w-full items-center justify-center">
          <p className="text-lg">Publish a workout to start recieving downloads and see them here</p>
        </div>
      )}
    </Card>
  );
}