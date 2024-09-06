'use client';
// ui components
import {
  CardTitle,
  CardDescription,
  CardHeader,
  CardContent,
  Card,
} from '@/components/ui/card';
import { buttonVariants } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover.jsx';
import { BadgeHelp } from 'lucide-react';
//

import Link from 'next/link.js';

// helpers
import logger from '@/lib/logger';
import { calculateBMI, getBMICategory } from '@/utils/BMICalculator.js';
//

// state management
import { useAtom } from 'jotai';
import { userBMI } from '@/store.js';
import { useEffect, useCallback } from 'react';
//

const setStatusColor = (bmi: string) => {
  if ('Underweight' === bmi) {
    return 'text-destructive';
  }
  if ('Normal weight' === bmi) {
    return 'text-success';
  }
  if ('Overweight' === bmi) {
    return 'text-warning';
  }
  if ('Obese' === bmi) {
    return 'text-primary';
  }
  return 'text-primary-foreground';
};

const bmiTooltipDesc =
  'Body mass index (BMI) is a person’s weight in kilograms divided by the square of height in meters. BMI is an inexpensive and easy screening method for weight category—underweight, healthy weight, overweight, and obesity.BMI does not measure body fat directly, but BMI is moderately correlated with more direct measures of body fat';

type BMICardProps = Readonly<{
  weight: string;
  height: string;
}>;

export default function BMICard({ weight, height }: BMICardProps) {
  const [bmi, setBmi] = useAtom(userBMI);
  const statusTextColor = setStatusColor(bmi?.category ?? '');
  logger.debug(`Weight: ${weight}, Height: ${height}`);

  // Calculate BMI
  const newBMI = useCallback(
    (weight: string, height: string) => {
      const bmiScore = calculateBMI(weight, height);
      const bmiCategory = getBMICategory(bmiScore);
      const newBMI = {
        score: bmiScore,
        category: bmiCategory,
      };
      setBmi(newBMI);
    },
    [setBmi]
  );
  //
  useEffect(() => {
    newBMI(weight, height);
  }, [weight, height, newBMI]);
  //
  logger.debug(`BMI: ${bmi}`);
  return (
    <Card className="my-6 bg-transparent">
      <CardHeader>
        <div className="flex items-center space-x-4">
          <div className="flex flex-col dark:text-primary-foreground light: text-primary">
            <div className="flex flex-row gap-2">
              <CardTitle className="text-sm">Your BMI</CardTitle>
              {/* help popover tooltip */}
              <Popover>
                <PopoverTrigger className="max-w-[50%]">
                  <BadgeHelp className="w-4 h-4 active:text-primary" />
                </PopoverTrigger>
                <PopoverContent>
                  {bmiTooltipDesc}
                  <br />
                  <Link
                    className={`${buttonVariants({
                      variant: 'link',
                      size: 'xxs',
                      className: 'text-[8px] leading-none pl-1',
                    })} `}
                    href="https://www.cdc.gov/healthyweight/assessing/bmi/adult_bmi/index.html"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Source
                  </Link>
                </PopoverContent>
              </Popover>
              {/* end of popover tooltip */}
            </div>
            <CardDescription className="text-sm">
              Body Mass Index
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="flex items-center justify-center h-[200px]">
          <div className="flex flex-col items-center">
            <h1 className="text-6xl font-extrabold tracking-tighter dark:text-primary-foreground light: text-gray-700">
              {bmi?.score}
            </h1>
            <p
              className={`text-sm ${statusTextColor} font-medium tracking-wide uppercase opacity-60`}
            >
              {bmi?.category}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
