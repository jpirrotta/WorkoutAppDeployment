'use client';

import { Bar, BarChart, CartesianGrid, XAxis } from 'recharts';
import useInsights from '@/hooks/insights/useInsights';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from '@/components/ui/chart';
import { WeightFatChartConfig } from '@/components/dashboard-charts/config';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
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
import { TrendingUp, TrendingDown } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import useScreenSize from '@/hooks/useScreenSize';

const getTrendPercentage = (start: number, end: number) => {
  return parseFloat((((end - start) / start) * 100).toFixed(2));
};

const calculateYearlyTrends = (data: { weight: number; fat: number }[]) => {
  if (data.length < 2) return { weightTrend: 0, fatTrend: 0 };

  const startWeight = data[0].weight;
  const endWeight = data[data.length - 1].weight;
  const startFat = data[0].fat;
  const endFat = data[data.length - 1].fat;

  return {
    weightTrend: getTrendPercentage(startWeight, endWeight),
    fatTrend: getTrendPercentage(startFat, endFat),
  };
};

const trendClass = (trend: number) =>
  trend < 0 ? 'text-success' : 'text-destructive';

export default function WeightFatBarChart() {
  const { data: userInsights } = useInsights();
  const [selectedYear, setSelectedYear] = useState<number>();
  const screenSize = useScreenSize();

  const insightsData = useMemo(() => {
    if (!userInsights) {
      return { chartData: {}, years: [] };
    }

    const chartData = userInsights.weightHistory.reduce(
      (acc, weight, index) => {
        const year = new Date(weight.date).getFullYear();
        const month = new Date(weight.date).toLocaleDateString('en-US', {
          month: 'short',
        });

        if (!acc[year]) {
          acc[year] = [];
        }

        acc[year].push({
          month,
          weight: weight.value,
          fat: userInsights.bodyFatHistory[index].value,
        });

        return acc;
      },
      {} as Record<number, { month: string; weight: number; fat: number }[]>
    );

    const years = Array.from(
      new Set(
        userInsights.weightHistory.map((weight) =>
          new Date(weight.date).getFullYear()
        )
      )
    );

    return { chartData, years };
  }, [userInsights]);

  useEffect(() => {
    if (!selectedYear && insightsData.years.length > 0)
      setSelectedYear(insightsData.years[0]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [insightsData.years]);

  const selectedYearData = useMemo(() => {
    return selectedYear ? insightsData.chartData[selectedYear] || [] : [];
  }, [selectedYear, insightsData.chartData]);

  const { weightTrend, fatTrend } = calculateYearlyTrends(selectedYearData);

  return (
    <Card className="w-full">
      {userInsights?.weightHistory && (userInsights?.weightHistory.length > 0) ? (
        <>
          <CardHeader className="flex flex-col sm:flex-row justify-between gap-3">
            <div className="sm:space-y-2">
              <div className="flex flex-row items-center justify-between gap-3">
                <CardTitle>Weight & Fat</CardTitle>
                <Select
                  defaultValue={`${selectedYear}`}
                  value={`${selectedYear}`}
                  onValueChange={(value) => setSelectedYear(Number(value))}
                >
                  <SelectTrigger className="w-[8rem] bg-card">
                    <SelectValue placeholder="Select Year" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Year</SelectLabel>
                      {insightsData.years.map((year) => (
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
              </div>
              <CardDescription>Your Fat & Weight Yearly Forecast</CardDescription>
            </div>
            <div className="space-y-2">
              <div className="flex gap-2 font-medium leading-none">
                Fat is trending {fatTrend > 0 ? 'up' : 'down'} by{' '}
                <span className={`${trendClass(fatTrend)} flex flex-row gap-2`}>
                  {fatTrend}% {fatTrend > 0 ? <TrendingUp /> : <TrendingDown />}
                </span>
              </div>
              <div className="flex gap-2 font-medium leading-none">
                Weight is trending {weightTrend > 0 ? 'up' : 'down'} by{' '}
                <span className={`${trendClass(weightTrend)} flex flex-row gap-2 `}>
                  {' '}
                  {weightTrend}%{' '}
                  {weightTrend > 0 ? <TrendingUp /> : <TrendingDown />}
                </span>
              </div>
            </div>
          </CardHeader>
          <CardContent id="card-pie" className="h-full">
            <ChartContainer
              config={WeightFatChartConfig}
              className="min-h-[200px] h-full w-full"
            >
              <BarChart
                accessibilityLayer
                data={selectedYearData}
                margin={{ bottom: screenSize.width > 1280 ? 120 : 0 }}
              >
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="month"
                  tickLine={false}
                  tickMargin={10}
                  axisLine={false}
                  tickFormatter={(value) => value.slice(0, 3)}
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <ChartLegend content={<ChartLegendContent />} />
                <Bar
                  dataKey="weight"
                  className="rounded-3xl "
                  fill="var(--color-weight)"
                  radius={4}
                />
                <Bar dataKey="fat" fill="var(--color-fat)" radius={4} />
              </BarChart>
            </ChartContainer>
          </CardContent>
          <CardFooter className="flex-col items-start gap-2 text-sm"></CardFooter>
        </>
      ) : (
        <>
          <CardHeader className="flex flex-row justify-center">
            <CardTitle>Weight & Fat</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-center text-lg">Update your profile to see weight and fat forecast here</p>
          </CardContent>
        </>
      )}
    </Card>
  );
}
