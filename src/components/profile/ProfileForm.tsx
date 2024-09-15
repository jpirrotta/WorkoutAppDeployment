'use client';
// Libs
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useEffect } from 'react';

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

export default function ProfileForm() {
  const { user } = useUser();
  const [selectedTab, setSelectedTab] = useAtom(measurementAtom);
  const mutation = useUserProfileMutate('update');
  // ? see profile form re-render issues
  const setUserProfileData = useSetAtom(userAtom);
  const {
    data: userData,
    error: userDataError,
    isLoading: userDataLoading,
  } = useUserProfile();

  useEffect(() => {
    if (userDataError) {
      toast.info('Hi! Your Profile Data is Empty', {
        description: userDataError.message,
      });
    }
  }, [userDataError]);

  useEffect(() => {
    if (userData) {
      console.log(userData);
      setUserProfileData(userData);
    }
  }, [userData, setUserProfileData]);

  const defaultMeasurement =
    selectedTab === 'imperial'
      ? ImperialMetricConversion(
          selectedTab,
          userData?.profile?.weight,
          userData?.profile?.height
        )
      : {
          weight: userData?.profile?.weight,
          height: userData?.profile?.height,
        };

  const defaultValues = {
    userId: userData?.userId ?? user?.id ?? '',
    name: userData?.name ?? user?.fullName ?? '',
    profile: {
      age: userData?.profile?.age,
      gender: userData?.profile?.gender,
      weight: defaultMeasurement.weight,
      height: defaultMeasurement.height,
      bodyFat: userData?.profile?.bodyFat,
    },
  };

  const form = useForm<z.infer<typeof profileFormSchema>>({
    resolver: zodResolver(profileFormSchema),
    defaultValues,
  });

  // Watch the weight and height fields
  const watchedWeight = form.watch('profile.weight');
  const watchedHeight = form.watch('profile.height');

  const isFormDataEmpty = (
    values: z.infer<typeof profileFormSchema>
  ): boolean => {
    const isEmpty = JSON.stringify(defaultValues) === JSON.stringify(values);
    if (!isEmpty) {
      console.info('Form data has changed from the default values');
    }
    return isEmpty;
  };

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

  const handleOnReset = () => {
    if (!isFormDataEmpty(form.getValues())) {
      form.reset();
      console.info('Form has been reset');
    }
  };

  const onSubmit = async (values: z.infer<typeof profileFormSchema>) => {
    if (isFormDataEmpty(form.getValues())) {
      toast.info('No changes', {
        description: 'You have not made any changes to your profile',
      });
      console.log('formData: ', values);
    } else {
      mutation.mutate(values);
      console.log('formData: ', values);
    }
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
      <p className="pb-2 text-2xl font-bold italic text-primary">
        Hi there {userData?.name ?? ''} 👋
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
          {/* Body Fat */}
          <FormField
            control={form.control}
            name="profile.bodyFat"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Body Fat %</FormLabel>
                <FormControl>
                  <Input placeholder="0" min={0} type="number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* Form Buttons */}
          <div className="flex justify-center gap-3 md:justify-start">
            <Button type="submit">Submit</Button>
            <Button type="reset" variant="outline" onClick={handleOnReset}>
              Reset
            </Button>
          </div>
        </form>
      </Form>
      <ProfileBMI weight={watchedWeight} height={watchedHeight} />
      {userData?.userId && <DeleteProfileData user={userData} />}
    </section>
  );
}
