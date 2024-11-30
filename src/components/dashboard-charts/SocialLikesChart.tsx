'use client';

import { Workout, YearDictionary } from '@/types';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts';
import { useGetAllWorkouts } from '@/hooks/workout/useWorkoutQueries';
import { LikesChartConfig } from '@/components/dashboard-charts/config';
import { useMemo, useState } from 'react';
import logger from '@/lib/logger';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from '@/components/ui/chart';


const extractLikesData = (userWorkouts: Workout[]) => {
  const likesData: {userId: String, date: Date}[] = [];

  // Extract likes from each workout
  userWorkouts.forEach((workout: Workout) => {
    if (workout.likes.length > 0) {
      //console.log("Likes inside workout *", workout.name, "* - ", workout.likes);
      likesData.push(...workout.likes);
    }
  });

  return likesData;
};

const sortLikesByDate = (likesData: {userId: String, date: Date}[]) => {
  const likesByYear: YearDictionary = {};
  const defaultMonthObject = {
    January: 0,
    February: 0,
    March: 0,
    April: 0,
    May: 0,
    June: 0,
    July: 0,
    August: 0,
    September: 0,
    October: 0,
    November: 0,
    December: 0,
  };

  // Create dictionary for each year from the year of app launch to current year
  const initialYear = 2024;  //Year of app launch
  const currentYear = new Date().getFullYear();
  for (let year = initialYear; year <= currentYear; year++) {
    likesByYear[year] = {...defaultMonthObject};
  }

  // Count likes for each month of each year
  likesData.forEach(like => {
    const likeDate = new Date(like.date);  //Ensure like.date is a Date object
    const likeYear = likeDate.getFullYear();
    const likeMonth = likeDate.toLocaleString('default', { month: 'long' }) as keyof typeof defaultMonthObject;

    if (likesByYear[likeYear]) {
      likesByYear[likeYear][likeMonth]++;
    } else {
      logger.info(`Year "${likeYear}" of like from userId "${like.userId}"  not found in likesByYear`);
    }
  });

  return likesByYear;
};


export default function SocialLikesChart() {
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());
  const { data: userWorkouts } = useGetAllWorkouts();
  
  const likesByYear = useMemo(() => {
    if (!userWorkouts) {
      return [];
    }

    return sortLikesByDate(extractLikesData(userWorkouts));
  }, [userWorkouts]);
  
  // Fetch and format data for the selected year
  const selectedYearData = useMemo(() => {
    let returnData = [];

    if (likesByYear[selectedYear]) {
      for (const [month, value] of Object.entries(likesByYear[selectedYear])) {
        returnData.push({
          month,
          likes: value
        });
      }
    }

    return returnData;
  }, [selectedYear, userWorkouts]);

  // Used for determining the Y-axis domain
  const maxLikes = useMemo(() => {
    return Math.max(...selectedYearData.map(data => data.likes));
  }, [selectedYearData]);

  // Check if there are any likes in the data
  const hasLikesAboveZero = useMemo(() => {
    return Object.values(likesByYear).some(yearData =>
      Object.values(yearData).some(monthValue => monthValue > 0)
    );
  }, [likesByYear]);

  return (
    <Card className="flex flex-col w-full">
      { hasLikesAboveZero ? (
        <>
          <CardHeader className="flex flex-row items-center justify-between pb-4">
            <CardTitle className="flex-1 text-center">Likes Activity Timeline</CardTitle>
              <Select
                defaultValue={`${selectedYear}`}
                value={`${selectedYear}`}
                onValueChange={(value) => setSelectedYear(Number(value))}
              >
                <SelectTrigger className="w-[8rem] ml:auto bg-card">
                  <SelectValue placeholder="Select Year" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Year</SelectLabel>
                    {Object.keys(likesByYear).map((year) => (
                      <SelectItem
                        key={year}
                        value={year.toString()}
                        onClick={(val) => setSelectedYear(Number(val))}
                      >
                        {year}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            <CardDescription></CardDescription>
          </CardHeader>
          <CardContent className="flex-1">
            <ChartContainer
              config={LikesChartConfig}
              className="mx-auto aspect-square max-h-[40rem] pb-0"
            >
              <BarChart
                accessibilityLayer
                data={selectedYearData}
              >
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="month"
                  tickLine={false}
                  tickMargin={10}
                  axisLine={true}
                  tickFormatter={(value) => value.slice(0, 3)}
                />
                <YAxis
                  tickLine={false}
                  tickMargin={10}
                  axisLine={true}
                  allowDecimals={false}
                  domain={[0, maxLikes]}
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <ChartLegend content={<ChartLegendContent />} />
                <Bar
                  dataKey="likes"
                  className="rounded-3xl "
                  fill="var(--color-likes)"
                  radius={4}
                />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </> 
      ) : (
        <>
          <CardHeader className="flex flex-row justify-center">
            <CardTitle>Likes Activity Timeline</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-center text-lg">Publish a workout to start receiving likes and see them here</p>
          </CardContent>
        </>
      )}
    </Card>
  );
}