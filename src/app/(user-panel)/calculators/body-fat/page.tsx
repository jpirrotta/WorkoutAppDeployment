// src/(user-panel)/calculators/body-fat/page.tsx
'use client'

import { useState, useEffect, useMemo } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import { ImperialMetricConversion } from '@/utils/ImperialMetricConversion';

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

// Schema for form validation
const bodyFatFormSchema = z.object({
    age: z.coerce
        .number({ message: 'Age must be between 8-99' })
        .min(1)
        .max(99)
        .optional(),

    gender: z.enum(['male', 'female', 'other']).optional().default('other'),

    weight: z.coerce
        .number({ message: 'Weight must be between 1-300' })
        .min(1)
        .optional(),

    height: z.coerce
        .number({ message: 'Height must be between 1-300' })
        .min(1)
        .optional(),

    waist: z.coerce.number().min(0.1).optional(),
    neck: z.coerce.number().min(0.1).optional(),
    hip: z.coerce.number().optional(), // Only for females

    formula: z.enum(['Navy', 'BMI']).optional().default('Navy'),
});

export default function BodyFatCalculator() {
    const [selectedTab, setSelectedTab] = useState('metric');

    const { data: userData } = useUserProfile();

    // State for results
    const [bodyFatPercentage, setBodyFatPercentage] = useState<number | null>(null);

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

    // Default form values
    const defaultValues = useMemo(
        () => ({
            age: userData?.profile?.age ?? 0,
            gender: userData?.profile?.gender,
            weight: userData?.profile?.weight ?? 0,
            height: userData?.profile?.height ?? 0,
            waist: 50,
            neck: 20,
            hip: 0,
            formula: 'Navy' as 'Navy' | 'BMI',
        }),
        [userData]
    );

    const form = useForm<z.infer<typeof bodyFatFormSchema>>({
        resolver: zodResolver(bodyFatFormSchema),
        defaultValues,
    });

    useEffect(() => {
        if (userData) {
            form.reset(defaultValues);
        }
    }, [userData, defaultValues, form]);

    // Switch between metric and imperial
    const handleTabChange = (newTab: 'imperial' | 'metric') => {
        setSelectedTab(newTab);
        const convertedData = ImperialMetricConversion(
            newTab,
            form.getValues('weight'),
            form.getValues('height'),
            form.getValues('waist'),
            form.getValues('neck'),
            form.getValues('hip')
        );

        form.setValue('weight', convertedData.weight);
        form.setValue('height', convertedData.height);
        form.setValue('waist', convertedData.waist);
        form.setValue('neck', convertedData.neck);
        form.setValue('hip', convertedData.hip);
    };

    // Calculate Body Fat Percentage using the Navy formula
    const calculateNavyBodyFat = (
        waist: number,
        neck: number,
        height: number,
        gender: string,
        hip?: number
    ): number => {
        if (selectedTab === 'metric') {
            // Convert cm to inches for calculation
            waist /= 2.54; // Convert cm to inches
            neck /= 2.54;   // Convert cm to inches
            height /= 2.54; // Convert cm to inches
            hip = hip ? hip / 2.54 : 0; // Convert cm to inches
        }
        else {
            // Convert ft to inches for calculation
            waist *= 12; // Convert ft to inches
            neck *= 12;   // Convert ft to inches
            height *= 12; // Convert ft to inches
            hip = hip ? hip * 12 : 0; // Convert ft to inches
        }

        if (gender === 'male') {
            const bodyFatPercentage =
                86.010 * Math.log10(waist - neck) - 70.041 * Math.log10(height) + 36.76;
            return Number(bodyFatPercentage.toFixed(2));
        } else if (gender === 'female' && hip !== undefined) {
            const bodyFatPercentage = 163.205 * Math.log10(waist + hip - neck)
                - 97.684 * Math.log10(height) - 78.387;
            return Number(bodyFatPercentage.toFixed(2));
        } else {
            toast.error('Hip measurement is required');
            return 0;
        }
    };

    // Calculate Body Fat Percentage using the BMI method
    const calculateBMIBodyFat = (
        weight: number,
        age: number,
        height: number,
        gender: string,
    ): number => {
        if (selectedTab === 'metric') {
            // Convert cm to inches for calculation
            weight *= 2.205; // Convert kg to lbs
            height /= 2.54; // Convert cm to inches
        }
        else {
            // Convert ft to inches for calculation
            height *= 12; // Convert ft to inches
        }

        let bodyFat = 0;

        if (gender === 'male') {
            // bodyFat = 86.010 * Math.log10(waist - neck) - 70.041 * Math.log10(height) + 36.76;
            bodyFat = 1.20 * (703 * (weight / (height * height))) + 0.23 * age - 16.2;
        } else if (gender === 'female') {
            bodyFat = 1.20 * (weight / height) + 0.23 * age - 5.4;
        } else {
            toast.error('Hip measurement is required');
            return 0;
        }

        return bodyFat;
    }

    // Handle submission and calculation
    const onSubmit = (data: any) => {
        let { weight, height, waist, neck, hip, gender, age } = data;

        // Apply the correct formula for body fat calculation
        let bodyFat = 0;
        if (data.formula === 'Navy') {
            bodyFat = calculateNavyBodyFat(waist, neck, height, gender, hip);
        } else if (data.formula === 'BMI') {
            bodyFat = calculateBMIBodyFat(weight, age, height, gender);
        }

        // Set the body fat percentage
        setBodyFatPercentage(parseFloat(bodyFat.toFixed(2)));
    };

    return (
        <section className="flex-1 flex-col justify-center w-full xl:w-[80%] light: text-foreground">
            {/* Page Header */}
            <p className="text-2xl font-bold w-full flex justify-center mb-4 flex-col items-center">
                <span className='text-primary'>
                    Body Fat Calculator
                </span>
                <span className='text-base opacity-50 font-normal'>
                    By default your saved data is used
                </span>
            </p>

            {/* Form */}
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

                    {/* Metric/Imperial Tabs */}
                    <Tabs
                        value={selectedTab}
                        onValueChange={(value) =>
                            handleTabChange(value as "imperial" | "metric")
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

                    {/* Measurements */}
                    <div className="flex gap-5 w-full">
                        {/* Weight */}
                        <FormField
                            control={form.control}
                            name="weight"
                            render={({ field }) => (
                                <FormItem className="w-full">
                                    <FormLabel>Weight {selectedTab === 'metric' ? '(kg)' : '(lbs)'}</FormLabel>
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
                                    <FormLabel>Height {selectedTab === 'metric' ? '(cm)' : '(inches)'}</FormLabel>
                                    <FormControl>
                                        <Input placeholder='Enter your height' min="1" step="any" type="number" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    {/* Waist, Neck, Hip (for females) */}
                    <div className="flex gap-5 w-full">
                        <FormField
                            control={form.control}
                            name="waist"
                            render={({ field }) => (
                                <FormItem className="w-full">
                                    <FormLabel>Waist {selectedTab === 'metric' ? '(cm)' : '(inches)'}</FormLabel>
                                    <FormControl>
                                        <Input placeholder='Enter your waist size' step="any" type="number" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="neck"
                            render={({ field }) => (
                                <FormItem className="w-full">
                                    <FormLabel>Neck {selectedTab === 'metric' ? '(cm)' : '(inches)'}</FormLabel>
                                    <FormControl>
                                        <Input placeholder='Enter your neck size' step="any" type="number" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    {/* Hip measurement (only for females) */}
                    {form.watch('gender') === 'female' && (
                        <FormField
                            control={form.control}
                            name="hip"
                            render={({ field }) => (
                                <FormItem className="w-full">
                                    <FormLabel>Hip {selectedTab === 'metric' ? '(cm)' : '(inches)'}</FormLabel>
                                    <FormControl>
                                        <Input placeholder='Enter your hip size' min="1" step="any" type="number" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    )}

                    {/* Formula selection */}
                    <FormField
                        control={form.control}
                        name="formula"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Formula</FormLabel>
                                <Select value={field.value} onValueChange={field.onChange}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder='Select formula' />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value="Navy">Navy Method</SelectItem>
                                        <SelectItem value="BMI">BMI Method</SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormDescription>
                                    Navy method uses waist, neck (and hip for females), BMI uses weight and height.
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Submit Button */}
                    <Button type="submit">
                        Calculate Body Fat
                    </Button>
                </form>
            </Form>

            <div className="flex justify-center flex-col items-center mt-4">
                <div className='border flex flex-col p-6 space-y-5 rounded-lg items-center'>
                    <p className='flex items-center font-bold'>
                        Your Body Fat Percentage:
                        <span className={`ml-4 mr-2 text-primary text-3xl font-semibold
              ${!bodyFatPercentage && 'opacity-70'}`}
                        >
                            {bodyFatPercentage ? bodyFatPercentage : 'N/A'}
                        </span>
                        %
                    </p>
                </div>
            </div>
        </section>
    );
}
