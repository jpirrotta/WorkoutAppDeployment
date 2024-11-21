import { TimerIcon, Dumbbell } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { WorkoutHistory } from '@/types';
import { TotalExercisesChartConfig } from '@/components/dashboard-charts/config';
import { Label, Pie, PieChart, LabelList } from 'recharts';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
type TimelineStampProps = {
  workout: WorkoutHistory;
};

export default function TimelineStamp({ workout }: TimelineStampProps) {
  const exerciseStats = () => {
    const stats = {
      totalExercises: 0,
      primaryMuscleTotals: {} as Record<string, number>,
      chartData: [] as { primaryMuscle: string; count: number; fill: string }[],
    };

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

    stats.chartData = Object.entries(stats.primaryMuscleTotals).map(
      ([primaryMuscle, count]) => ({
        primaryMuscle,
        count,
        fill: `var(--color-${primaryMuscle.replace(/\s/g, '')})`,
      })
    );

    return stats;
  };

  const { chartData, totalExercises } = exerciseStats();

  return (
    <Dialog>
      <DialogTrigger asChild>
        <div className="flex flex-col items-center  bg-accent-foreground rounded-lg w-40">
          <h4 className="text-base text-primary-foreground p-2">
            {workout.name}
          </h4>
          <div className="flex justify-between font-bold rounded-lg p-2 bg-card w-full">
            <p className="flex gap-1 ">
              {workout.completedExercises}
              <Dumbbell />
            </p>
            <p className="flex gap-1">
              {workout.duration}
              <TimerIcon className="w-6 h-6 mr-2" />
            </p>
          </div>
        </div>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-center">{workout.name}</DialogTitle>
          <DialogDescription className=""></DialogDescription>
        </DialogHeader>
        <div>
          <ChartContainer
            config={TotalExercisesChartConfig}
            className="mx-auto aspect-square max-h-[40rem] pb-0 [&_.recharts-pie-label-text]:fill-foreground"
          >
            <PieChart className="mx-auto">
              <ChartTooltip content={<ChartTooltipContent hideLabel />} />
              <Pie
                className="mx-auto"
                data={chartData}
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
                    ((val / totalExercises) * 100).toFixed(2) + '%'
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
                            {totalExercises.toLocaleString()}
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
        </div>
        <div className="flex flex-col gap-2 text-sm">
          {workout.exercises.map((exercise, index) => (
            <div key={index} className="flex justify-between sm:text-base">
              <p>{exercise.name}</p>
              <p>
                {exercise.sets.reduce((acc, set) => acc + set.sets, 0)} sets
              </p>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
