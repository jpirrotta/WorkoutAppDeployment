// src/(user-panel)/calculators/macros/page.tsx
'use client'

import { useState, useEffect, useMemo } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import { useAtom } from 'jotai';
import { measurementAtom } from '@/store';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { z } from 'zod';
import { toast } from 'sonner';

const macroFormSchema = z.object({
    calories: z.coerce.number({ message: 'Calories must be greater than 0' }).min(1).optional(),
    proteinRatio: z.coerce.number().min(0).max(100).optional(),
    fatRatio: z.coerce.number().min(0).max(100).optional(),
    carbRatio: z.coerce.number().min(0).max(100).optional(),
});

export default function MacroCalculator() {
    const [selectedTab, setSelectedTab] = useAtom(measurementAtom);

    // State for results
    const [proteinGrams, setProteinGrams] = useState<number | null>(null);
    const [fatGrams, setFatGrams] = useState<number | null>(null);
    const [carbGrams, setCarbGrams] = useState<number | null>(null);

    const defaultValues = useMemo(
        () => ({
            calories: 2000, // Default to 2000 calories, or could pull from user's TDEE
            proteinRatio: 30, // Default to 30% protein
            fatRatio: 30, // Default to 30% fat
            carbRatio: 40, // Default to 40% carbs
        }),
        []
    );

    const form = useForm<z.infer<typeof macroFormSchema>>({
        resolver: zodResolver(macroFormSchema),
        defaultValues,
    });

    // Function to calculate macros in grams
    const calculateMacros = (calories: number, proteinRatio: number, fatRatio: number, carbRatio: number) => {
        const proteinCalories = (calories * proteinRatio) / 100;
        const fatCalories = (calories * fatRatio) / 100;
        const carbCalories = (calories * carbRatio) / 100;

        const proteinGrams = proteinCalories / 4; // 4 calories per gram of protein
        const fatGrams = fatCalories / 9; // 9 calories per gram of fat
        const carbGrams = carbCalories / 4; // 4 calories per gram of carbs

        setProteinGrams(Math.round(proteinGrams));
        setFatGrams(Math.round(fatGrams));
        setCarbGrams(Math.round(carbGrams));
    };

    // handle form submission
    const onSubmit = async (values: z.infer<typeof macroFormSchema>) => {
        console.log(`Form submitted with values: ${JSON.stringify(values)}`);

        if (values.calories === undefined) {
            toast.error('Please enter your daily calorie intake.');
            return;
        }

        const totalRatio = (values.proteinRatio ?? 0) + (values.fatRatio ?? 0) + (values.carbRatio ?? 0);
        if (totalRatio !== 100) {
            toast.error('The total percentage of macronutrients must add up to 100%.');
            return;
        }

        calculateMacros(values.calories, values.proteinRatio!, values.fatRatio!, values.carbRatio!);
    };

    return (
        <section className="flex-1 flex-col justify-center w-full xl:w-[80%] light: text-foreground">
            {/* Page Header */}
            <p className="text-2xl font-bold w-full flex justify-center mb-4 flex-col items-center">
                <span className='text-primary'>
                    Macronutrient Calculator
                </span>
                <span className='text-base opacity-50 font-normal'>
                    Calculate your daily macronutrient intake
                </span>
            </p>

            {/* Input Fields */}
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="justify-center space-y-8"
                >
                    {/* Calories */}
                    <FormField
                        control={form.control}
                        name="calories"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Calories</FormLabel>
                                <FormControl>
                                    <Input type="number" placeholder='Enter your daily calorie intake' {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Protein Ratio */}
                    <FormField
                        control={form.control}
                        name="proteinRatio"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Protein Ratio (%)</FormLabel>
                                <FormControl>
                                    <Input type="number" placeholder='Enter protein percentage' {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Fat Ratio */}
                    <FormField
                        control={form.control}
                        name="fatRatio"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Fat Ratio (%)</FormLabel>
                                <FormControl>
                                    <Input type="number" placeholder='Enter fat percentage' {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Carb Ratio */}
                    <FormField
                        control={form.control}
                        name="carbRatio"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Carbohydrates Ratio (%)</FormLabel>
                                <FormControl>
                                    <Input type="number" placeholder='Enter carb percentage' {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Button to calculate macros */}
                    <Button type="submit">
                        Calculate Macros
                    </Button>
                </form>
            </Form>

            {/* Display results */}
            <div className="flex justify-center flex-col items-center mt-4">
                <div className='border flex flex-col p-6 space-y-5 rounded-lg items-center'>
                    <p className='font-bold'>
                        Protein:
                        <span className={`ml-4 mr-2 text-primary text-3xl font-semibold ${!proteinGrams && 'opacity-70'}`}>
                            {proteinGrams ? proteinGrams : 'N/A'}
                        </span>
                        g/day
                    </p>
                    <p className='font-bold'>
                        Fat:
                        <span className={`ml-4 mr-2 text-primary text-3xl font-semibold ${!fatGrams && 'opacity-70'}`}>
                            {fatGrams ? fatGrams : 'N/A'}
                        </span>
                        g/day
                    </p>
                    <p className='font-bold'>
                        Carbs:
                        <span className={`ml-4 mr-2 text-primary text-3xl font-semibold ${!carbGrams && 'opacity-70'}`}>
                            {carbGrams ? carbGrams : 'N/A'}
                        </span>
                        g/day
                    </p>
                </div>
            </div>
        </section>
    )
}
