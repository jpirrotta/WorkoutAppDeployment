'use client';

import { Label, Pie, PieChart, LabelList } from 'recharts';
import useInsights from '@/hooks/insights/useInsights';
import { TotalExercisesChartConfig } from '@/components/dashboard-charts/config';
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
import { useMemo } from 'react';

export default function TotalExercisesPieChart() {
  const { data: userInsights } = useInsights();
  const exerciseStats = useMemo(() => {
    const stats = {
      totalExercises: 0,
      primaryMuscleTotals: {} as Record<string, number>,
      chartData: [] as { primaryMuscle: string; count: number; fill: string }[],
    };

    userInsights?.workoutHistory?.forEach((workout) => {
      workout.exercises.forEach((exercise) => {
        const primaryMuscle = exercise.primaryMuscle;
        const totalSets = exercise.sets.reduce(
          (setAcc, set) => setAcc + set.sets,
          0
        );

        stats.totalExercises += totalSets;
        if (stats.primaryMuscleTotals[primaryMuscle]) {
          stats.primaryMuscleTotals[primaryMuscle] += totalSets;
        } else {
          stats.primaryMuscleTotals[primaryMuscle] = totalSets;
        }
      });
    });

    stats.chartData = Object.entries(stats.primaryMuscleTotals).map(
      ([primaryMuscle, count]) => ({
        primaryMuscle,
        count,
        fill: `var(--color-${primaryMuscle.replace(/\s/g, '')})`,
      })
    );

    return stats;
  }, [userInsights]);

  return (
    <Card className="flex flex-col w-full">
      {userInsights?.workoutHistory && (userInsights.workoutHistory.length > 0) ? (
        <>
          <CardHeader className="items-center pb-0">
            <CardTitle>Exercise Muscle Group Distribution</CardTitle>
            <CardDescription></CardDescription>
          </CardHeader>
          <CardContent className="flex-1">
            <ChartContainer
              config={TotalExercisesChartConfig}
              className="mx-auto aspect-square max-h-[40rem] pb-0 [&_.recharts-pie-label-text]:fill-foreground"
            >
              <PieChart className="mx-auto">
                <ChartTooltip content={<ChartTooltipContent hideLabel />} />
                <Pie
                  className="mx-auto"
                  data={exerciseStats.chartData}
                  dataKey="count"
                  nameKey="primaryMuscle"
                  innerRadius={60}
                  strokeWidth={2}
                >
                  <LabelList
                    className="fill-foreground text-[0.7rem] sm:text-[1rem] font-bold"
                    stroke="none"
                    dataKey="primaryMuscle"
                    position="middle"
                  />
                  <LabelList
                    className="fill-foreground "
                    stroke="none"
                    dataKey="count"
                    position="outside"
                    formatter={(val: number) =>
                      ((val / exerciseStats.totalExercises) * 100).toFixed(2) + '%'
                    }
                  ></LabelList>
                  <Label
                    content={({ viewBox }) => {
                      if (viewBox && 'cx' in viewBox && 'cy' in viewBox) {
                        return (
                          <text
                            x={viewBox.cx}
                            y={viewBox.cy}
                            textAnchor="middle"
                            dominantBaseline="middle"
                          >
                            <tspan
                              x={viewBox.cx}
                              y={viewBox.cy}
                              className="fill-foreground text-3xl font-bold"
                            >
                              {exerciseStats.totalExercises.toLocaleString()}
                            </tspan>
                            <tspan
                              x={viewBox.cx}
                              y={(viewBox.cy || 0) + 24}
                              className="fill-muted-foreground"
                            >
                              Total Sets
                            </tspan>
                          </text>
                        );
                      }
                    }}
                  />
                </Pie>
              </PieChart>
            </ChartContainer>
          </CardContent>
          <CardFooter className="flex-col gap-2 text-sm">
            <div className="leading-none text-muted-foreground">
              Showing total sets performed by muscle group since joining
            </div>
          </CardFooter>
        </>
      ) : (
        <div id="no-data" className="flex w-full items-center justify-center">
          <p className="text-lg">Workout to see your exercise chart here</p>
        </div>
      )}
    </Card>
  );
}
