'use client';
// Libs
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import logger from '@/lib/logger.js';
import { profileFormSchema } from '@/models/ProfileFormSchema.js';
import { useToast } from '@/components/ui/use-toast';
import _ from 'lodash';
//!

// utils
import { useUser } from '@clerk/clerk-react';
import EmpiricalMetricConversion from '@/lib/EmpiricalMetricConversion.js';
import getUserProfileData from '@/lib/getUserProfileData.js';
//!

// State
import { useAtom } from 'jotai';
import { measurementAtom, profileDataAtom } from '../../../store.js';
import { useEffect } from 'react';
//!

// UI components
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/Select';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/Form';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/Tabs';
//!

export default function ProfileForm() {
  // state to manage the selected tab imperial or metric
  const [selectedTab, setSelectedTab] = useAtom(measurementAtom);
  // state to manage the user profile data
  const [userProfileData, setUserProfileData] = useAtom(profileDataAtom);
  const { toast } = useToast();
  // use the useUser hook to get the current user
  const { user } = useUser();
  // critical default values
  const userId = user?.id;
  const userName = user?.fullName;
  //

  // only fetch the data once when the component mounts-
  useEffect(() => {
    logger.info('Fetching user profile data');
    async function fetchData() {
      // if the userProfileData is not available, fetch it
      // otherwise the data is already available and we don't need to fetch it again
      // userProfileData is saved in the store and will persist even if the component is unmounted
      if (!userProfileData) {
        logger.info('Fetched from the server');
        const data = await getUserProfileData(userId);
        setUserProfileData(data);
      }
      else{
        logger.info('Fetched from the store / cache');
      }
    }
    fetchData();
  }, [userProfileData, userId, setUserProfileData]);

  // define the form and its default values
  const form = useForm({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      userId: userProfileData?.userId || userId,
      name: userProfileData?.name || userName,
      profile: {
        age: userProfileData?.profile?.age,
        sex: userProfileData?.profile?.sex,
        weight: userProfileData?.profile?.weight,
        height: userProfileData?.profile?.height,
        bodyFat: userProfileData?.profile?.bodyFat,
      },
    },
  });
  //

  // checks if the form data is totally empty or the same as the user data
  const isFormDataEmpty = (formData) => {
    for (const key in formData.profile) {
      if (formData.profile[key]) {
        return false;
      }
    }
    return true;
  };
  //

  const onSubmit = async (data) => {
    if (isFormDataEmpty(data)) {
      logger.info(
        'Form data is empty / user data is the same as the form data'
      );
      return;
    }

    // Data is saved in Numerical format by default in the db
    // first check if the selected tab is empirical
    if (selectedTab === 'empirical') {
      // if it is, convert the form data to numerical
      const convertedData = EmpiricalMetricConversion(
        'numerical',
        data.profile.weight,
        data.profile.height
      );
      // set the converted data to the form data
      data.profile.weight = convertedData.weight;
      data.profile.height = convertedData.height;
      // log  the converted data
      logger.info('Converted Data: \n', convertedData);
    }
    try {
      const response = await fetch('/api/profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        logger.info(`Profile updated for user: ${userId} | ${userName}`);
        toast({
          title: 'Profile updated',
          description: 'Your profile has been updated successfully.',
        });

        // update the user profile data state
        setUserProfileData((value) => {
          return _.merge(value, data);
        });
        // `data` will have the real types from the zod schema
        // where the string values are converted to numbers
        // form.getValues() will have the string values and we want
        // to repopulate the form with string not to get errors
        // zod, mongoose abd react-hook-form will handle the conversion
        // form.reset(form.getValues());
      } else {
        logger.error(
          `Server error on profile update for user: ${userId} | ${userName}`
        );
        toast({
          variant: 'destructive',
          title: 'Uh oh! Something went wrong.',
          description:
            'There was a problem updating your profile. Please try again later.',
        });
      }
    } catch (error) {
      logger.error('Error updating profile: ', error);
      toast({
        variant: 'destructive',
        title: 'Uh oh! There is a Network Error',
        description: 'Unable to process profile update. Check your connection.',
      });
    }

    logger.info('Updated fields are: \n', data);
  };

  // When the tab is changed, convert the weight and height fields
  const handleTabChange = (newTab) => {
    setSelectedTab(newTab);
    const formData = form.getValues();

    // Check if the form data is empty, only the weight and height fields are required
    // for the conversion / tab change
    if (!formData.profile.weight && !formData.profile.height) {
      console.log('Theres no data to convert');
    } else {
      // if not empty, convert the form data
      const convertedData = EmpiricalMetricConversion(
        newTab,
        formData.profile.weight,
        formData.profile.height
      );

      // set the converted data to the form data
      form.setValue('profile.weight', convertedData.weight);
      form.setValue('profile.height', convertedData.height);
    }
  };
  //

  return (
    <section className="flex flex-col w-full xl:w-[80%] light: text-foreground">
      <h2 className="pb-2 text-4xl font-bold italic text-primary">Profile</h2>
      <p className="pb-4 text:md text-slate-400">Hi there {userName} 👋</p>
      <Form {...form} className="flex justify-center">
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          {/* Age */}
          <FormField
            control={form.control}
            name="profile.age"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Age</FormLabel>
                <FormControl>
                  <Input
                    defaultValue={userProfileData?.profile?.age}
                    min={0}
                    type="number"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* Sex/Gender */}
          <FormField
            control={form.control}
            name="profile.sex"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Sex</FormLabel>
                <FormControl>
                  <Select
                    {...field}
                    defaultValue="other"
                    onValueChange={(value) => field.onChange(value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup className="SelectLabel">
                        <SelectLabel>Options</SelectLabel>
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* Weight */}
          <div className="flex gap-5 w-full">
            <FormField
              control={form.control}
              name="profile.weight"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>
                    Weight {selectedTab === 'numerical' ? '(kg)' : '(lbs)'}
                  </FormLabel>
                  <FormControl>
                    <Input
                      defaultValue={userProfileData?.profile?.weight}
                      min="0"
                      step="any"
                      type="number"
                      {...field}
                    />
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
                    Height {selectedTab === 'numerical' ? '(cm)' : '(ft)'}
                  </FormLabel>
                  <FormControl>
                    <Input
                      defaultValue={userProfileData?.profile?.height}
                      min="0"
                      step="any"
                      type="number"
                      {...field}
                    />
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
                  <Input
                    defaultValue={userProfileData?.profile?.bodyFat}
                    min={0}
                    type="number"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* metric or empirical tab */}
          <Tabs
            defaultValue="numerical"
            value={selectedTab}
            onValueChange={(value) => handleTabChange(value)}
          >
            <TabsList className="grid w-full grid-cols-2 light: bg-background light: border-border light: border-2">
              <TabsTrigger className="px-10" value="empirical">
                Empirical
              </TabsTrigger>
              <TabsTrigger className="px-10" value="numerical">
                Numerical
              </TabsTrigger>
            </TabsList>
          </Tabs>
          {/*! End of Tab  !*/}
          <div className="flex justify-center md:justify-start">
            <Button type="submit">Submit</Button>
          </div>
        </form>
      </Form>
    </section>
  );
}
