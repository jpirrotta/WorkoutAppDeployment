import { Scale, BadgeHelp } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import Link from 'next/link';
import { buttonVariants } from '@/components/ui/button';

const bmiTooltipDesc =
  'Body mass index (BMI) is a person’s weight in kilograms divided by the square of height in meters. BMI is an inexpensive and easy screening method for weight category—underweight, healthy weight, overweight, and obesity.BMI does not measure body fat directly, but BMI is moderately correlated with more direct measures of body fat';

export default function ProfileBMIAlert() {
  return (
    <div className="Alert py-4">
      <Alert>
        <Scale className="h-4 w-4" />
        <AlertTitle>
          Get BMI Insights!
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
        </AlertTitle>
        <AlertDescription>
          Enter your weight and height to get insights about your Body Mass
          Index (BMI).
        </AlertDescription>
      </Alert>
    </div>
  );
}
