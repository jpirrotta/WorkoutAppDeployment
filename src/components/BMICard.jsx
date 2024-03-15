import {
  CardTitle,
  CardDescription,
  CardHeader,
  CardContent,
  Card,
} from '@/components/ui/card';
import logger from '@/lib/logger';
import calculateBMI from '@/utils/BMICalculator';

export default function BMICard({weight, height}) {
  logger.info(`Weight: ${weight}, Height: ${height}`)
  const bmi = calculateBMI(weight, height, 'metric');
  logger.info(`BMI: ${bmi}`)
  return (
    <Card className="my-6">
      <CardHeader>
        <div className="flex items-center space-x-4">
          <div className="flex flex-col">
            <CardTitle className="text-sm">Your BMI</CardTitle>
            <CardDescription className="text-sm">
              Body Mass Index
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="flex items-center justify-center h-[200px]">
          <div className="flex flex-col items-center">
            <h1 className="text-6xl font-extrabold tracking-tighter">24.5</h1>
            <p className="text-sm font-medium tracking-wide uppercase opacity-60">
              Normal
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
