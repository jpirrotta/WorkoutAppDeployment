'use client';

import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useAtom } from 'jotai';
import { measurementAtom } from '../../../store.js';
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
} from '@/components/ui/form';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/Tabs';

// this is a zod schema for the profile form
// zod is a library for data validation and parsing
// which will help us validate the data before sending it to the server
// Define your input Zod schema
const profileFormSchema = z.object({
  userId: z.string(),
  name: z.string(),
  profile: z.object({
    age: z
      .string()
      .transform((val, ctx) => {
        const age = parseInt(val);
        if (isNaN(age)) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'must be a number',
          });
          return z.NEVER;
        }
        if (age < 8 || age > 99) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'Age must be between 8 and 99',
          });
          return z.NEVER;
        }
        return age;
      })
      .optional(),

    sex: z.enum(['male', 'female', 'other']).optional(),
    weight: z
      .string()
      .transform((val, ctx) => {
        const weight = parseInt(val);
        if (isNaN(weight)) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'must be a number',
          });
          return z.NEVER;
        }
        if (weight < 20 || weight > 200) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'Weight must be between 20 and 200',
          });
          return z.NEVER;
        }
        return weight;
      })
      .optional(),

    height: z
      .string()
      .transform((val, ctx) => {
        const height = parseInt(val);
        if (isNaN(height)) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'must be a number',
          });
          return z.NEVER;
        }
        if (height < 100 || height > 250) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'Height must be between 100 and 250',
          });
          return z.NEVER;
        }
        return height;
      })
      .optional(),
    bodyFat: z
      .string()
      .transform((val, ctx) => {
        const bodyFat = parseInt(val);
        if (isNaN(bodyFat)) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'must be a number',
          });
          return z.NEVER;
        }
        if (bodyFat < 5 || bodyFat > 50) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'Body Fat must be between 5 and 50',
          });
          return z.NEVER;
        }
        return bodyFat;
      })
      .optional(),
  }),
});

export default function ProfileForm() {
  // state for the form
  const [selectedTab, setSelectedTab] = useAtom(measurementAtom);

  // 1. define the form
  const form = useForm({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      userId: '123',
      name: 'John Doe',
    },
  });

  // Function to convert form data based on selected tab
  const convertFormData = (selectedTab, formData) => {
    if (selectedTab === 'empirical') {
      // Convert numerical data to empirical
      formData.profile.weight = (
        parseFloat(formData.profile.weight) * 2.20462
      ).toFixed(2);
      formData.profile.height = (
        parseFloat(formData.profile.height) * 0.0328084
      ).toFixed(2);
    } else if (selectedTab === 'numerical') {
      console.log('Converting to numerical');
      // Convert empirical data to numerical
      formData.profile.weight = (
        parseFloat(formData.profile.weight) / 2.20462
      ).toFixed(2);
      formData.profile.height = (
        parseFloat(formData.profile.height) / 0.0328084
      ).toFixed(2);
    }
    return formData;
  };

  // 2. handle form submission
  const onSubmit = (data) => {
    // TODO send the data to the db
    // log data before converting
    console.log('Before: \n', data);

    // Convert form data based on selected tab
    data = convertFormData(selectedTab, data);

    // ? for now just log the data
    console.log('After: \n', data);
  };

  // When the tab is changed, convert the form data
  const handleTabChange = (newTab) => {
    setSelectedTab(newTab);
    const formData = form.getValues();

    // Check if the form data is empty, only the weight and height fields are required
    if (formData.profile.weight || formData.profile.height) {
      return;
    }
    // if not empty, convert the form data
    const convertedData = convertFormData(newTab, formData);

    // Set each field value manually to trigger a re-render
    for (const key in convertedData.profile) {
      form.setValue(`profile.${key}`, convertedData.profile[key]);
    }
  };

  return (
    <section className="flex flex-col w-full xl:w-[80%]">
      <h2 className="pb-2 text-4xl font-bold italic text-primary">Profile</h2>
      <Form {...form} className="flex justify-center">
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
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
          <FormField
            control={form.control}
            name="profile.sex"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Sex</FormLabel>
                <FormControl>
                  <Select {...field}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
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
                    <Input type="number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="profile.height"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>
                    Height {selectedTab === 'numerical' ? '(cm)' : '(ft)'}
                  </FormLabel>
                  <FormControl>
                    <Input type="number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormField
            control={form.control}
            name="profile.bodyFat"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Body Fat %</FormLabel>
                <FormControl>
                  <Input type="number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* metric or empirical */}
          <Tabs
            defaultValue="numerical"
            onValueChange={(value) => handleTabChange(value)}
          >
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger className="px-10" value="empirical">
                Empirical
              </TabsTrigger>
              <TabsTrigger className="px-10" value="numerical">
                Numerical
              </TabsTrigger>
            </TabsList>
          </Tabs>
          {/*!  !*/}
          <div className="flex justify-center md:justify-start">
            <Button type="submit">Submit</Button>
          </div>
        </form>
      </Form>
    </section>
  );
}
