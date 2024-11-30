'use client';

import { Workout, YearDictionary } from '@/types';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts';
import { useGetAllWorkouts } from '@/hooks/workout/useWorkoutQueries';
import { DownloadsChartConfig } from '@/components/dashboard-charts/config';
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


const extractSavesData = (userWorkouts: Workout[]) => {
  const savesData: {userId: String, date: Date}[] = [];

  // Extract saves from each workout
  userWorkouts.forEach((workout: Workout) => {
    if (workout.saves.length > 0) {
      savesData.push(...workout.saves);
    }
  });

  return savesData;
};

const sortSavesByDate = (savesData: {userId: String, date: Date}[]) => {
  const savesByYear: YearDictionary = {};
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
    savesByYear[year] = {...defaultMonthObject};
  }

  // Count saves for each month of each year
  savesData.forEach(save => {
    const saveDate = new Date(save.date);  //Ensure save.date is a Date object
    const saveYear = saveDate.getFullYear();
    const saveMonth = saveDate.toLocaleString('default', { month: 'long' }) as keyof typeof defaultMonthObject;

    if (savesByYear[saveYear]) {
      savesByYear[saveYear][saveMonth]++;
    } else {
      logger.info(`Year "${saveYear}" of download from userId "${save.userId}"  not found in savesByYear`);
    }
  });

  return savesByYear;
};


export default function SocialDownloadsChart() {
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());
  const { data: userWorkouts } = useGetAllWorkouts();
  
  const savesByYear = useMemo(() => {
    if (!userWorkouts) {
      return [];
    }

    return sortSavesByDate(extractSavesData(userWorkouts));
  }, [userWorkouts]);
  
  // Fetch and format data for the selected year
  const selectedYearData = useMemo(() => {
    let returnData = [];

    if (savesByYear[selectedYear]) {
      for (const [month, value] of Object.entries(savesByYear[selectedYear])) {
        returnData.push({
          month,
          saves: value
        });
      }
    }

    return returnData;
  }, [selectedYear, userWorkouts]);

  // Used for determining the Y-axis domain
  const maxSaves = useMemo(() => {
    return Math.max(...selectedYearData.map(data => data.saves));
  }, [selectedYearData]);

  // Check if there are any saves in the data
  const hasSavesAboveZero = useMemo(() => {
    return Object.values(savesByYear).some(yearData =>
      Object.values(yearData).some(monthValue => monthValue > 0)
    );
  }, [savesByYear]);

  return (
    <Card className="flex flex-col w-full">
      <CardHeader className="flex flex-row items-center justify-between pb-4">
        <CardTitle className="flex-1 text-center">Downloads Activity Timeline</CardTitle>
        { hasSavesAboveZero && ( 
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
                {Object.keys(savesByYear).map((year) => (
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
        )}
        <CardDescription></CardDescription>
      </CardHeader>
      <CardContent className="flex-1">
        { hasSavesAboveZero ? ( 
          <ChartContainer
            config={DownloadsChartConfig}
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
                domain={[0, maxSaves]}
              />
              <ChartTooltip content={<ChartTooltipContent />} />
              <ChartLegend content={<ChartLegendContent />} />
              <Bar
                dataKey="saves"
                className="rounded-3xl "
                fill="var(--color-saves)"
                radius={4}
              />
            </BarChart>
          </ChartContainer>
        ) : (
          <div className="flex w-full items-center justify-center">
            <p className="text-lg">Publish a workout to start recieving downloads and see them here</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}