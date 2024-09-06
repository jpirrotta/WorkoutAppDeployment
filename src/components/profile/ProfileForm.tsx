'use client';
// Libs
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, SubmitHandler } from 'react-hook-form';
import logger from '@/lib/logger.js';
import _ from 'lodash';

// utils
import { profileFormSchema } from '@/models/ProfileFormSchema';
import { useUser } from '@clerk/clerk-react';
import {
  ImperialMetricConversion,
  lbsToKg,
  kgToLbs,
  ftToCm,
  cmToFt,
} from '@/utils/ImperialMetricConversion';
import getUserProfileData from '@/lib/getUserProfileData';
import deepPickBy from '@/utils/deepPickBy';

// State
import { useAtom } from 'jotai';
import { measurementAtom, profileDataAtom } from '@/store';
import { useEffect, useState } from 'react';

// UI components
import { LoaderCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface ProfileFormData {
  userId: string;
  name: string;
  profile: {
    age: string;
    gender: string;
    weight: string;
    height: string;
    bodyFat: string;
  };
}

export default function ProfileForm() {
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const [selectedTab, setSelectedTab] = useAtom(measurementAtom);
  const [userProfileData, setUserProfileData] = useAtom(profileDataAtom);
  const { user } = useUser();
  const userId = user?.id ?? '';
  const userName = user?.fullName ?? '';

  // TODO - Refactor this
  setUserProfileData((value) => {
    if (!value) {
      return {
        userId: userId,
        userName: userName,
        profile: {},
      };
    }
    return value;
  });

  const stateUserId = userProfileData?.userId;
  const stateUserName = userProfileData?.userName;
  const stateAge = userProfileData?.profile?.age;
  const stateGender = userProfileData?.profile?.gender;
  const stateWeight = userProfileData?.profile?.weight;
  const stateHeight = userProfileData?.profile?.height;
  const stateBodyFat = userProfileData?.profile?.bodyFat;

  const form = useForm<ProfileFormData>({
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

  // TODO - Refactor this
  useEffect(() => {
    logger.info('Fetching user profile data');
    async function fetchData() {
      if (!userProfileData) {
        logger.info('Fetching from the server');
        const data = await getUserProfileData(userId);
        logger.info('Returned User data: \n', data);
        if (data) {
          setUserProfileData((value) => {
            return {
              ...value,
              profile: { ...data.profile },
            };
          });
          logger.info('User has no profile data');
        }
        setIsLoading(false);
      } else {
        setIsLoading(false);
        logger.info('Fetched from the store / cache');
      }
    }
    fetchData();
    handleOnReset();
  }, []);

  const isAgeGenderSame = (formData: ProfileFormData) => {
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

    if (stateAge === formAge && !formGender) {
      logger.info('Age is the same but the form gender is empty');
      return true;
    }
    if (stateGender === formGender && !formAge) {
      logger.info('gender is the same but the form age is empty');
      return true;
    }
    if (stateAge === formAge && stateGender === formGender) {
      logger.info('Both age and gender are the same');
      return true;
    }
    if (stateWeight === formWeight && stateHeight === formHeight) {
      logger.info('Both weight and height are the same');
      return true;
    }
    if (stateBodyFat === formBodyFat) {
      logger.info('Body fat is the same');
      return true;
    }

    logger.info('Form data is different from the user data');
    return false;
  };

  const isFormDataEmpty = (formData: ProfileFormData) => {
    for (const key in formData.profile) {
      if (formData.profile[key as keyof typeof formData.profile]) {
        logger.info('Form data is not empty');
        return false;
      }
    }
    return true;
  };

  const handleOnReset = () => {
    if (isFormDataEmpty(form.getValues())) {
      return;
    }
    logger.info(`gender: ${userProfileData?.profile?.gender}`);
    logger.info('Form reset');
    if (form.getValues('profile.age')) form.setValue('profile.age', '');
    if (form.getValues('profile.gender')) form.setValue('profile.gender', '');
    if (form.getValues('profile.weight')) form.setValue('profile.weight', '');
    if (form.getValues('profile.height')) form.setValue('profile.height', '');
    if (form.getValues('profile.bodyFat')) form.setValue('profile.bodyFat', '');

    logger.debug('RESET FORM User data: \n', userProfileData);
  };

  const onSubmit: SubmitHandler<ProfileFormData> = async (data) => {
    if (isFormDataEmpty(data) || isAgeGenderSame(data)) {
      logger.info(
        'Form data is empty / user data is the same as the form data'
      );
      return;
    }

    if (selectedTab === 'imperial') {
      logger.info('Converting form data to metric before submission');
      const convertedData = ImperialMetricConversion(
        'metric',
        data.profile.weight,
        data.profile.height
      );
      if (convertedData.weight) {
        form.setValue('profile.weight', convertedData.weight);
        data.profile.weight = convertedData.weight;
      }
      if (convertedData.height) {
        form.setValue('profile.height', convertedData.height);
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
    setUserProfileData((value) => {
      const validData = deepPickBy(
        data,
        (val) => !isNaN(val) && val !== undefined
      );
      return _.merge(value, validData);
    });
    logger.debug('User data: \n', userProfileData);
    handleOnReset();
  };

  const handleTabChange = (newTab: 'imperial' | 'metric') => {
    setSelectedTab(newTab);
    const formData = form.getValues();

    if (!formData.profile.weight && !formData.profile.height) {
      logger.info('Theres no data to convert');
    } else {
      const convertedData = ImperialMetricConversion(
        newTab,
        formData.profile.weight,
        formData.profile.height
      );
      form.setValue('profile.weight', convertedData?.weight ?? '');
      form.setValue('profile.height', convertedData?.height ?? '');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center">
        <LoaderCircle className="text-primary text-3xl animate-spin" />
      </div>
    );
  }

  return (
    <section className="flex-1 flex-col w-full xl:w-[80%] light: text-foreground">
      <h2 className="pb-2 text-4xl font-bold italic text-primary">Profile</h2>
      <p className="pb-4 text:md text-slate-400">Hi there {userName} 👋</p>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex justify-center space-y-8"
        >
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
                  // placeholder={stateGender.toString() ?? ''}
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
              <TabsTrigger className="px-10" value="imperial">
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
      <ProfileBMI
        weight={userProfileData?.profile?.weight}
        height={userProfileData?.profile?.height}
      />
      {userProfileData && (
        <DeleteProfileData resetForm={handleOnReset} userId={userId} />
      )}
    </section>
  );
}
