import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, SubmitHandler } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';

const searchBarFormSchema = z.object({
  search: z.string().optional(),
});

type SearchBarFormSchema = z.infer<typeof searchBarFormSchema>;

interface ExercisesSearchBarProps {
  onSearch: (searchTerm: string | undefined) => void;
}

export default function ExercisesSearchBar({
  onSearch,
}: ExercisesSearchBarProps) {
  const form = useForm<SearchBarFormSchema>({
    resolver: zodResolver(searchBarFormSchema),
    defaultValues: {
      search: '', // Initialize with an empty string to ensure controlled input
    },
    shouldUnregister: false,
  });

  const onSubmit: SubmitHandler<SearchBarFormSchema> = (data) => {
    if (!data.search) {
      return onSearch(undefined);
    }

    const searchedExercise = data.search.toLowerCase();
    onSearch(searchedExercise);
  };

  return (
    <section className="flex flex-col w-full light:text-foreground px-8 py-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="search"
            render={({ field }) => (
              <FormItem>
                <FormControl className="relative">
                  <div>
                    <Input
                      type="text"
                      placeholder="Find an exercise"
                      className="border border-black dark:border-input"
                      {...field}
                    />

                    <Search
                      type='submit'
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
