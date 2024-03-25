'use client';
// Libs
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import logger from '@/lib/logger.js';
import _ from 'lodash';
//!

// utils
import { profileFormSchema } from '@/models/ProfileFormSchema.js';
import { useUser } from '@clerk/clerk-react';
import {
  ImperialMetricConversion,
  lbsToKg,
  kgToLbs,
  ftToCm,
  cmToFt,
} from '@/utils/ImperialMetricConversion.js';
import getUserProfileData from '@/lib/getUserProfileData.js';
import deepPickBy from '@/utils/deepPickBy.js';
//!

// State
import { useAtom } from 'jotai';
import { measurementAtom, profileDataAtom } from '../../../store.js';
import { useEffect, useState } from 'react';
//!

// UI components
import Spinner from '@/components/svgs/Spinner.svg';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import DeleteProfileData from '@/components/Profile/DeleteProfileData';
import ProfileBMI from '@/components/Profile/ProfileBMI';
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
  const [isLoading, setIsLoading] = useState(true);
  // use the useToast hook to show toast messages
  const { toast } = useToast();
  // state to manage the selected tab imperial or metric
  const [selectedTab, setSelectedTab] = useAtom(measurementAtom);
  // state to manage the user profile data
  const [userProfileData, setUserProfileData] = useAtom(profileDataAtom);
  // use the useUser hook to get the current user
  const { user } = useUser();
  // critical default values
  const userId = user?.id;
  const userName = user?.fullName;
  // get the user profile data from the store for easy access
  const stateUserId = userProfileData?.userId;
  const stateUserName = userProfileData?.userName;
  const stateAge = userProfileData?.profile?.age;
  const stateGender = userProfileData?.profile?.gender;
  const stateWeight = userProfileData?.profile?.weight;
  const stateHeight = userProfileData?.profile?.height;
  const stateBodyFat = userProfileData?.profile?.bodyFat;
  //

  // define the form and its default values
  const form = useForm({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      userId: stateUserId || userId,
      name: stateUserName || userName,
      profile: {
        age: stateAge?.toString() || '',
        gender: stateGender?.toString() || '',
        weight: stateWeight?.toString() || '',
        height: stateHeight?.toString() || '',
        bodyFat: stateBodyFat?.toString() || '',
      },
    },
  });

  // only fetch the data once when the component mounts
  useEffect(() => {
    logger.info('Fetching user profile data');
    async function fetchData() {
      // if the userProfileData is not available, fetch it
      // otherwise the data is already available and we don't need to fetch it again
      // userProfileData is saved in the store and will persist even if the component is unmounted
      if (!userProfileData) {
        logger.info('Fetched from the server');
        const data = await getUserProfileData(userId);
        if (data) {
          setUserProfileData(data);
          logger.info('User has no profile data');
        }

        setIsLoading(false);
      } else {
        setIsLoading(false);
        logger.info('Fetched from the store / cache');
      }
    }
    fetchData();
    // cleanup the form when the component is unmounted
    handleOnReset();
  }, [userId, setUserProfileData, selectedTab]);

  // check if the form values match the user data, if they do, don't submit the form
  // do the check only for age and gender
  const isAgeGenderSame = (formData) => {
    const formAge = formData.profile.age;
    const formGender = formData.profile.gender;
    const formWeight = formData.profile.weight;
    const formHeight = formData.profile.height;
    const formBodyFat = formData.profile.bodyFat;

    if (!userProfileData || !stateAge || !stateGender) {
      logger.info('User data is not available');
      return false;
    }
    logger.debug('Checking if the form data is the same as the user data');

    // 1. if the age is the same but the form gender is empty
    if (stateAge === formAge && !formGender) {
      logger.info('Age is the same but the form gender is empty');
      return true;
    }
    // 2. if the gender is the same but the form age is empty
    if (stateGender === formGender && !formAge) {
      logger.info('gender is the same but the form age is empty');
      return true;
    }
    // 3. if the age and gender are the same as the user data
    if (stateAge === formAge && stateGender === formGender) {
      logger.info('Both age and gender are the same');
      return true;
    }
    // 4. if the weight and height are the same as the user data
    if (stateWeight === formWeight && stateHeight === formHeight) {
      logger.info('Both weight and height are the same');
      return true;
    }
    // 5. if the body fat is the same as the user data
    if (stateBodyFat === formBodyFat) {
      logger.info('Body fat is the same');
      return true;
    }

    logger.info('Form data is different from the user data');
    return false;
  };

  //
  // checks if the form data is totally empty or the same as the user data
  const isFormDataEmpty = (formData) => {
    for (const key in formData.profile) {
      if (formData.profile[key]) {
        logger.info('Form data is not empty');
        return false;
      }
    }
    return true;
  };
  //

  const handleOnReset = () => {
    if (isFormDataEmpty(form.getValues())) {
      return;
    }
    logger.info(`gender: ${userProfileData?.profile?.gender}`);
    logger.info('Form reset');
    // if a field is not empty, set it to empty
    if (form.getValues('profile.age')) form.setValue('profile.age', '');
    if (form.getValues('profile.gender')) form.setValue('profile.gender', '');
    if (form.getValues('profile.weight')) form.setValue('profile.weight', '');
    if (form.getValues('profile.height')) form.setValue('profile.height', '');
    if (form.getValues('profile.bodyFat')) form.setValue('profile.bodyFat', '');

    // log the user data
    logger.debug('RESET FORM User data: \n', userProfileData);
  };

  const onSubmit = async (data) => {
    if (isFormDataEmpty(data) || isAgeGenderSame(data)) {
      logger.info(
        'Form data is empty / user data is the same as the form data'
      );
      return;
    }

    // Data is saved in metric format by default in the db
    // first check if the selected tab is imperial
    if (selectedTab === 'imperial') {
      logger.info('Converting form data to metric before submission');
      // if it is, convert the form data to metric
      const convertedData = ImperialMetricConversion(
        'metric',
        data.profile.weight,
        data.profile.height
      );
      // set the converted data to the form data
      if (convertedData.weight !== null) {
        form.setValue('profile.weight', convertedData.weight);
        data.profile.weight = convertedData.weight;
      }
      if (convertedData.height !== null) {
        form.setValue('profile.height', convertedData.height);
        // update the data object with the converted data
        data.profile.height = convertedData.height;
      }

      logger.debug('Converted Data: \n', convertedData);
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
    // update the user profile data state
    // this will only update the fields that have been changed
    // to the user profile data state
    setUserProfileData((value) => {
      // Remove NaN and undefined values from data
      const validData = deepPickBy(
        data,
        (val) => !isNaN(val) && val !== undefined
      );
      // Merge validData with the current state
      return _.merge(value, validData);
    });
    // reset the form after submission
    // log the satet of the user data
    logger.debug('User data: \n', userProfileData);
    handleOnReset();
  };

  // When the tab is changed, convert the weight and height fields
  const handleTabChange = (newTab) => {
    setSelectedTab(newTab);
    const formData = form.getValues();

    // Check if the form data is empty, only the weight and height fields are required
    // for the conversion / tab change
    if (!formData.profile.weight && !formData.profile.height) {
      logger.info('Theres no data to convert');
    } else {
      // if not empty, convert the form data
      const convertedData = ImperialMetricConversion(
        newTab,
        formData.profile.weight,
        formData.profile.height
      );
      // only if the converted data is not null or undefined
      // set the converted data to the form data
      form.setValue('profile.weight', convertedData?.weight || '');
      // set the converted data to the form data
      form.setValue('profile.height', convertedData?.height || '');
    }
  };
  //

  if (isLoading) {
    return (
      <div className="flex items-center justify-center">
        <Spinner className="text-primary text-3xl" />
      </div>
    );
  }

  return (
    <section className="flex-1 flex-col w-full xl:w-[80%] light: text-foreground">
      <h2 className="pb-2 text-4xl font-bold italic text-primary">Profile</h2>
      <p className="pb-4 text:md text-slate-400">Hi there {userName} 👋</p>
      <Form {...form} className="flex justify-center">
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          {/* Age */}
          <FormField
            control={form.control}
            name="profile.age"
            defaultValue={stateAge}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Age</FormLabel>
                <FormControl>
                  <Input
                    placeholder={stateAge?.toString() || ''}
                    min={0}
                    type="number"
                    {...field}
                  />
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
                <Select
                  onValueChange={field.onChange}
                  placeholder={stateGender?.toString()}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue
                        defaultValue={stateGender?.toString() || ''}
                        placeholder={
                          stateGender?.toString().charAt(0).toUpperCase() +
                            stateGender?.toString().slice(1) || ''
                        }
                      />
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
                    <Input
                      placeholder={
                        selectedTab === 'metric'
                          ? stateWeight?.toString()
                          : kgToLbs(stateWeight)?.toString()
                      }
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
                    Height {selectedTab === 'metric' ? '(cm)' : '(ft)'}
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder={
                        selectedTab === 'metric'
                          ? stateHeight?.toString()
                          : cmToFt(stateHeight)?.toString()
                      }
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
                    placeholder={stateBodyFat?.toString()}
                    min={0}
                    type="number"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* metric or imperial tab */}
          <Tabs
            defaultValue="metric"
            value={selectedTab}
            onValueChange={(value) => handleTabChange(value)}
          >
            <TabsList className="grid w-full grid-cols-2 light: bg-background light: border-border light: border-2">
              <TabsTrigger className="px-10" value="impirical">
                Imperial
              </TabsTrigger>
              <TabsTrigger className="px-10" value="metric">
                Metric
              </TabsTrigger>
            </TabsList>
          </Tabs>
          {/*! End of Tab  !*/}
          {/* Form Buttons */}
          <div className="flex justify-center gap-3 md:justify-start">
            <Button type="submit">Submit</Button>
            <Button type="reset" variant="outline" onClick={handleOnReset}>
              Reset
            </Button>
          </div>
        </form>
      </Form>
      {/* Show the BMI card if the user has saved data 
      otherwise it will show and alert*/}
      <ProfileBMI
        weight={userProfileData?.profile?.weight}
        height={userProfileData?.profile?.height}
      />

      {/* if the user has saved data, show the delete btn */}
      {userProfileData && (
        <DeleteProfileData resetForm={handleOnReset} userId={userId} />
      )}
    </section>
  );
}
