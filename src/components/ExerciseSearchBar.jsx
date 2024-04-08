import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Input } from '@/components/ui/Input';
import MagnifyingGlass from '@/components/svgs/MagnifyingGlass.svg';
import { Button } from './ui/Button';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/Form';

const searchBarFormSchema = z.object({
  search: z.string().optional(),
});

export default function ExercisesSearchBar({ onSearch }) {
  const form = useForm({
    resolver: zodResolver(searchBarFormSchema),
    shouldUnregister: false,
  });

  const onSubmit = (data) => {
    if (!data.search) {
      return onSearch('');
    }

    const searchedExercise = data.search.toLowerCase();
    onSearch(encodeURIComponent(searchedExercise));
  };

  return (
    <section className="flex flex-col w-full light:text-foreground mb-5 px-8">
      <Form {...form} className="flex justify-center">
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="search"
            render={({ field }) => (
              <FormItem>
                <FormControl className="relative">
                  <div>
                    <Input
                      type="string"
                      placeholder="Find an exercise"
                      className="border border-black dark:border-input"
                      {...field}
                    />
                    <MagnifyingGlass
                      onClick={form.handleSubmit(onSubmit)}
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 hover:cursor-pointer"
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </form>
      </Form>
    </section>
  );
}
