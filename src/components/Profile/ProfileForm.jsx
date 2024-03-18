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
import { EmpiricalMetricConversion } from '@/utils/EmpiricalMetricConversion.js';
import getUserProfileData from '@/lib/getUserProfileData.js';
import deepPickBy from '@/utils/deepPickBy.js';
//!

// State
import { useAtom } from 'jotai';
import { measurementAtom, profileDataAtom } from '../../../store.js';
import { useEffect } from 'react';
//!

// UI components
import BMICard from '@/components/BMICard.jsx';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import DeleteProfileData from '@/components/Profile/DeleteProfileData';
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

  // define the form and its default values
  const form = useForm({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      userId: userProfileData?.userId || userId,
      name: userProfileData?.name || userName,
      profile: {
        age: userProfileData?.profile?.age?.toString() || '',
        sex: userProfileData?.profile?.sex?.toString(),
        weight: userProfileData?.profile?.weight?.toString() || '',
        height: userProfileData?.profile?.height?.toString() || '',
        bodyFat: userProfileData?.profile?.bodyFat?.toString() || '',
      },
    },
  });

  // only fetch the data once when the component mounts and when the form is updated
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
      } else {
        logger.info('Fetched from the store / cache');
      }
    }
    fetchData();
  }, []);

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

  const handleOnReset = () => {
    if (isFormDataEmpty(form.getValues())) {
      return;
    }
    logger.info('Form reset');
    // if a field is not empty, set it to empty
    if (form.getValues('profile.age')) form.setValue('profile.age', '');
    if (form.getValues('profile.sex')) form.setValue('profile.sex', '');
    if (form.getValues('profile.weight')) form.setValue('profile.weight', '');
    if (form.getValues('profile.height')) form.setValue('profile.height', '');
    if (form.getValues('profile.bodyFat')) form.setValue('profile.bodyFat', '');

    // log the user data
    logger.debug('RESET FORM User data: \n', userProfileData);
  };

  const onSubmit = async (data) => {
    if (isFormDataEmpty(data)) {
      logger.info(
        'Form data is empty / user data is the same as the form data'
      );
      return;
    }

    // Data is saved in metric format by default in the db
    // first check if the selected tab is empirical
    if (selectedTab === 'empirical') {
      logger.info('Converting form data to metric before submission');
      // if it is, convert the form data to metric
      const convertedData = EmpiricalMetricConversion(
        'metric',
        data.profile.weight,
        data.profile.height
      );
      // set the converted data to the form data
      convertedData.weight !== null &&
        form.setValue('profile.weight', convertedData.weight);
      convertedData.height !== null &&
        form.setValue('profile.height', convertedData.height);

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
      console.log('Theres no data to convert');
    } else {
      // if not empty, convert the form data
      const convertedData = EmpiricalMetricConversion(
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

  return (
    <section className="flex flex-col w-full xl:w-[80%]">
      <h2 className="pb-2 text-4xl font-bold italic text-primary">Profile</h2>
      <p className="pb-4 text:md text-slate-400">Hi there {userName} 👋</p>
      <Form {...form} className="flex justify-center">
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          {/* Age */}
          <FormField
            control={form.control}
            name="profile.age"
            defaultValue={userProfileData?.profile?.age}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Age</FormLabel>
                <FormControl>
                  <Input
                    placeholder={userProfileData?.profile?.age?.toString() || ""}
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
                <Select
                  onValueChange={field.onChange}
                  placeholder={userProfileData?.profile?.sex?.toString()}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue
                        defaultValue={userProfileData?.profile?.sex || ""}
                        placeholder={
                          userProfileData?.profile?.sex
                            ?.charAt(0)
                            .toUpperCase() +
                          userProfileData?.profile?.sex?.slice(1) || ""
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
                      placeholder={userProfileData?.profile?.weight?.toString()}
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
                      placeholder={userProfileData?.profile?.height?.toString()}
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
                    placeholder={userProfileData?.profile?.bodyFat?.toString()}
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
            defaultValue="metric"
            value={selectedTab}
            onValueChange={(value) => handleTabChange(value)}
          >
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger className="px-10" value="empirical">
                Empirical
              </TabsTrigger>
              <TabsTrigger className="px-10" value="metric">
                Metric
              </TabsTrigger>
            </TabsList>
          </Tabs>
          {/*! End of Tab  !*/}
          <div className="flex justify-center gap-3 md:justify-start">
            <Button type="submit">Submit</Button>
            <Button type="reset" variant="outline" onClick={handleOnReset}>
              Reset
            </Button>
          </div>
        </form>
      </Form>
      {/* if there is some profile data saved show the calculated BMI and DELETE option */}
      {userProfileData?.profile?.weight && userProfileData?.profile?.height && (
        <BMICard
          weight={userProfileData?.profile?.weight}
          height={userProfileData?.profile?.height}
        />
      )}
      {userProfileData && <DeleteProfileData userId={userId} />}
    </section>
  );
}
