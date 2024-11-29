'use client';

import { Workout } from '@/types';
import { Label, LabelList, LineChart } from 'recharts';
import { useGetAllWorkouts } from '@/hooks/workout/useWorkoutQueries';
import { LikesChartConfig } from '@/components/dashboard-charts/config';

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

export default function SocialLikesChart() {
  const { data: userWorkouts } = useGetAllWorkouts();

  const extractLikesAcrossTime = () => {
    const likesData: {userId: String, date: Date}[] = [];

    userWorkouts?.forEach((workout: Workout) => {
      if (workout.likes.length > 0) {
        //console.log("Likes inside workout *", workout.name, "* - ", workout.likes);
        likesData.push(...workout.likes);
      }
    });

    //console.log("Total Likes: ", likesData);
    return likesData;
  };
  const likesData = extractLikesAcrossTime();


  //if (likeData.length > 0) {}
  return (
    <Card className="flex flex-col w-full">
      {likesData && (likesData.length > 0) ? (
        <>
          <CardHeader className="items-center pb-0">
            <CardTitle>Likes Activity Timeline</CardTitle>
            <CardDescription></CardDescription>
          </CardHeader>
          <CardContent className="flex-1">
            <ChartContainer
              config={LikesChartConfig}
              className="mx-auto aspect-square max-h-[40rem] pb-0"
            >
              <>empty for now (add line graph)</>
            </ChartContainer>
          </CardContent>
          <CardFooter className="flex-col gap-2 text-sm">
            <div className="leading-none text-muted-foreground text-center">
              Showing total number of likes across all workouts your have published
            </div>
          </CardFooter>
        </>
      ) : (
        <div id="no-data" className="flex w-full items-center justify-center">
          <p className="text-lg">Publish a workout to start recieving likes and see them here</p>
        </div>
      )}
    </Card>
  );
}