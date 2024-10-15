// src/(user-panel)/calculators/calories/page.tsx
'use client'

import { useState, useEffect, useMemo } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import { ImperialMetricConversion } from '@/utils/ImperialMetricConversion';

import { useAtom } from 'jotai';
import { measurementAtom } from '@/store';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { z } from 'zod';
import { toast } from 'sonner';

import useUserProfile from '@/hooks/user/useUserProfile';

const calorieFormSchema = z.object({
  age: z.coerce
    .number({ message: 'Age must be between 8-99' })
    .min(1)
    .max(99)
    .optional(),

  gender: z.enum(['male', 'female', 'other']).optional().default('other'),

  weight: z.coerce
    .number({ message: 'Weight must be between 1-300' })
    .min(1)
    .max(300)
    .optional(),

  height: z.coerce
    .number({ message: 'Height must be between 1-300' })
    .min(1)
    .max(300)
    .optional(),

  activityLevel: z.enum(['1.2', '1.375', '1.55', '1.725', '1.9']).optional().default('1.375'),
});

export default function CaloriesCalculator() {
  const [selectedTab, setSelectedTab] = useAtom(measurementAtom);

  const {
    data: userData,
    error: userDataError,
    isLoading: userDataLoading,
  } = useUserProfile();

  // State for results
  const [caloriesNeeded, setCaloriesNeeded] = useState<number | null>(null);
  const [activityMultiplier, setActivityMultiplier] = useState<number | null>(null);

  const defaultMeasurement = useMemo(() => {
    return selectedTab === 'imperial'
      ? ImperialMetricConversion(
        selectedTab,
        userData?.profile?.weight,
        userData?.profile?.height
      )
      : {
        weight: userData?.profile?.weight,
        height: userData?.profile?.height,
      };
  }, [selectedTab, userData?.profile?.weight, userData?.profile?.height]);

  // calorie form default values
  const defaultValues = useMemo(
    () => ({
      age: userData?.profile?.age ?? 0,
      gender: userData?.profile?.gender,
      weight: userData?.profile?.weight ?? 0,
      height: userData?.profile?.height ?? 0,
      activityLevel: '1.2' as "1.2" | "1.375" | "1.55" | "1.725" | "1.9",
    }),
    [userData]
  );

  const form = useForm<z.infer<typeof calorieFormSchema>>({
    resolver: zodResolver(calorieFormSchema),
    defaultValues,
  });

  useEffect(() => {
    if (userData) {
      form.reset(defaultValues);
    }
  }, [userData, defaultValues, form]);

  // handle switching between metric and imperial tabs
  const handleTabChange = (newTab: 'imperial' | 'metric') => {
    setSelectedTab(newTab);
    const convertedData = ImperialMetricConversion(
      newTab,
      form.getValues('weight'),
      form.getValues('height')
    );

    form.setValue('weight', convertedData.weight);
    form.setValue('height', convertedData.height);
  };

  // Function to calculate BMR
  const calculateBMR = (weight: number | undefined, height: number | undefined, age: number | undefined, gender: string | undefined): number => {
    if (weight === undefined || height === undefined || age === undefined) {
      console.error('Missing required user data for BMR calculation');
      return 0; // Return a default value or handle the error as needed
    }

    if (selectedTab === 'imperial') {
      weight /= 2.205
      height *= 30.48
    }

    if (gender === 'male') {
      return 88.362 + (13.397 * weight) + (4.799 * height) - (5.677 * age);
    } else {
      return 447.593 + (9.247 * weight) + (3.098 * height) - (4.330 * age);
    }
  };

  // handle calculate TDEE
  const calculateTDEE = ({ weight, height, age, gender, activityLevel }:
    {
      weight?: number,
      height?: number,
      age?: number,
      gender: "male" | "female" | "other",
      activityLevel: "1.2" | "1.375" | "1.55" | "1.725" | "1.9"
    }) => {
    const activityLevelToNum = Number(activityLevel);
    const bmr = calculateBMR(weight, height, age, gender);
    const tdee = bmr * activityLevelToNum;

    setCaloriesNeeded(Math.round(tdee)); // Store result rounded
    setActivityMultiplier(activityLevelToNum);
  };

  // handle data submission and calorie calculation
  const onSubmit = async (values: z.infer<typeof calorieFormSchema>) => {
    console.log(`Form submitted with values: ${JSON.stringify(values)}`);

    let userInputVal = values;

    if (values.weight === undefined || values.height === undefined || values.age === undefined) {
      console.error('Missing required user data for TDEE calculation');
      toast.error('Missing required user data for TDEE calculation');
      return;
    }

    calculateTDEE(userInputVal);
  };

  return (
    <section className="flex-1 flex-col justify-center w-full xl:w-[80%] light: text-foreground">
      {/* Page Header */}
      <p className="text-2xl font-bold w-full flex justify-center mb-4 flex-col items-center">
        <span className='text-primary'>
          Calorie Calculator
        </span>
        <span className='text-base opacity-50 font-normal'>
          By default your saved data is used
        </span>
      </p>

      {/* Input Fields */}
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="justify-center space-y-8"
        >
          {/* Age */}
          <FormField
            control={form.control}
            name="age"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Age</FormLabel>
                <FormControl>
                  <Input type="number" placeholder='Enter your age' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Gender */}
          <FormField
            control={form.control}
            name="gender"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Gender</FormLabel>
                <Select value={field.value} onValueChange={field.onChange}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder='Select your gender' />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* metric or imperial tab */}
          <Tabs
            value={selectedTab}
            onValueChange={(value) =>
              handleTabChange(value as typeof selectedTab)
            }
          >
            <TabsList className="grid w-full grid-cols-2 light: bg-background">
              <TabsTrigger className="px-10" value="imperial">
                Imperial
              </TabsTrigger>
              <TabsTrigger className="px-10" value="metric">
                Metric
              </TabsTrigger>
            </TabsList>
          </Tabs>

          {/* Weight */}
          <div className="flex gap-5 w-full">
            <FormField
              control={form.control}
              name="weight"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>
                    Weight {selectedTab === 'metric' ? '(kg)' : '(lbs)'}
                  </FormLabel>
                  <FormControl>
                    <Input placeholder='Enter your weight' min="1" step="any" type="number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Height */}
            <FormField
              control={form.control}
              name="height"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>
                    Height {selectedTab === 'metric' ? '(cm)' : '(ft)'}
                  </FormLabel>
                  <FormControl>
                    <Input placeholder='Enter your height' min="1" step="any" type="number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Activity Level */}
          <FormField
            control={form.control}
            name="activityLevel"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Activity Level</FormLabel>
                <Select
                  value={field.value}
                  onValueChange={(value) => field.onChange(value as "1.2" | "1.375" | "1.55" | "1.725" | "1.9")}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder='Select your Activity Level' />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="1.2">Sedentary (little or no exercise)</SelectItem>
                    <SelectItem value="1.375">Lightly active (light exercise 1-3 days a week)</SelectItem>
                    <SelectItem value="1.55">Moderately active (moderate exercise 3-5 days a week)</SelectItem>
                    <SelectItem value="1.725">Very active (hard exercise 6-7 days a week)</SelectItem>
                    <SelectItem value="1.9">Super active (very hard exercise/physical job)</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Button to give result (calculate calories) */}
          <Button
            type="submit"
          >
            Calculate Calories
          </Button>
        </form>
      </Form>

      {/* Display results */}
      <div className="flex justify-center flex-col items-center mt-4">
        <div className='border flex flex-col p-6 space-y-5 rounded-lg items-center'>
          <p className='flex items-center font-bold'>
            Calories Needed:
            <span className={`ml-4 mr-2 text-primary text-3xl font-semibold
              ${!caloriesNeeded && 'opacity-70'}`}
            >
              {caloriesNeeded ? caloriesNeeded : 'N/A'}
            </span>
            kcal/day
          </p>
          {/* <p>
              Activity Multiplier:
              <span className={`ml-4 mr-2 text-primary text-2xl font-semibold
              ${!activityMultiplier && 'opacity-70'}`}
              >
                {activityMultiplier ? activityMultiplier : 'N/A'}
              </span>
            </p> */}
        </div>
      </div>
    </section>
  )
}
