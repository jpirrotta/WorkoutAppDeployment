'use client';
// Libs
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useEffect, useMemo, useState } from 'react';

// utils
import { profileFormSchema } from '@/models/ProfileFormSchema';
import { ImperialMetricConversion } from '@/utils/ImperialMetricConversion';

// State
import { useAtom, useSetAtom } from 'jotai';
import { measurementAtom, userAtom } from '@/store';
import { useUser } from '@clerk/clerk-react';

// UI components
import { LoaderCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import DeleteProfileData from '@/components/profile/DeleteProfileData';
import ProfileBMI from '@/components/profile/ProfileBMI';
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
import useUserProfileMutate from '@/hooks/user/useUserProfileMutate';

export default function Page() {
  const [selectedTab, setSelectedTab] = useAtom(measurementAtom);
  // ? see profile form re-render issues
  const {
    data: userData,
    error: userDataError,
    isLoading: userDataLoading,
  } = useUserProfile();

  const defaultValues = useMemo(
    () => ({
      userId: userData?.userId ?? '',
      name: userData?.name ?? '',
      profile: {
        age: userData?.profile?.age ?? 0,
        gender: userData?.profile?.gender ?? 'other',
        weight: userData?.profile?.weight ?? 0,
        height: userData?.profile?.height ?? 0,
      },
    }),
    [userData]
  );

  const form = useForm<z.infer<typeof profileFormSchema>>({
    resolver: zodResolver(profileFormSchema),
    defaultValues,
  });

  useEffect(() => {
    if (userData) {
      form.reset(defaultValues);
    }
  }, [userData, defaultValues]);

  // Watch the weight and height fields
  const watchedWeight = form.watch('profile.weight');
  const watchedHeight = form.watch('profile.height');

  const handleTabChange = (newTab: 'imperial' | 'metric') => {
    setSelectedTab(newTab);
    const convertedData = ImperialMetricConversion(
      newTab,
      form.getValues('profile.weight'),
      form.getValues('profile.height')
    );

    form.setValue('profile.weight', convertedData.weight);
    form.setValue('profile.height', convertedData.height);
  };

  const onSubmit = async (values: z.infer<typeof profileFormSchema>) => {

  };

  if (userDataLoading) {
    return (
      <div className="flex items-center justify-center">
        <LoaderCircle className="text-primary text-3xl animate-spin" />
      </div>
    );
  }

  return (
    <section className="flex-1 flex-col w-full xl:w-[80%] light: text-foreground">
      {/* Page Header */}
      <p className="text-2xl font-bold w-full flex justify-center mb-4 flex-col items-center">
        <span className='text-primary'>
          BMI Calculator
        </span>
        <span className='text-base opacity-50 font-normal'>
          By default your saved data is used
        </span>
      </p>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="justify-center space-y-8"
        >
          {/* Age */}
          <FormField
            control={form.control}
            name="profile.age"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Age</FormLabel>
                <FormControl>
                  <Input type="number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Gender */}
          <FormField
            control={form.control}
            name="profile.gender"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Gender</FormLabel>
                <Select value={field.value} onValueChange={field.onChange}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue />
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
              handleTabChange(value as 'imperial' | 'metric')
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
          {/*! End of Tab  !*/}

          {/* Weight */}
          <div className="flex gap-5 w-full">
            <FormField
              control={form.control}
              name="profile.weight"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>
                    Weight {selectedTab === 'metric' ? '(kg)' : '(lbs)'}
                  </FormLabel>
                  <FormControl>
                    <Input min="1" step="any" type="number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Height */}
            <FormField
              control={form.control}
              name="profile.height"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>
                    Height {selectedTab === 'metric' ? '(cm)' : '(ft)'}
                  </FormLabel>
                  <FormControl>
                    <Input min="1" step="any" type="number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Submit/Calculate Buttons */}
          <div className="flex justify-center gap-3 md:justify-start">
            <Button type="submit">Calculate BMI</Button>
          </div>
        </form>
      </Form>
      <ProfileBMI weight={watchedWeight} height={watchedHeight} />
    </section>
  );
}
