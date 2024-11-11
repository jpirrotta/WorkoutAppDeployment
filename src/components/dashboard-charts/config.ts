import { type ChartConfig } from '@/components/ui/chart';

export const chartConfig = {
  weight: {
    label: 'Weight',
    color: 'hsl(var(--primary))',
  },
  fat: {
    label: 'Fat',
    color: 'hsl(var(--secondary))',
  },
} satisfies ChartConfig;
