import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, SubmitHandler } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import SearchFilters from '@/components/SearchFilters';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';

const searchBarFormSchema = z.object({
  search: z.string().optional(),
});

type SearchBarFormSchema = z.infer<typeof searchBarFormSchema>;

export default function ExercisesSearchBar() {
  const form = useForm<SearchBarFormSchema>({
    resolver: zodResolver(searchBarFormSchema),
  });

  const onSubmit: SubmitHandler<SearchBarFormSchema> = (data) => {
    console.log(data);
  };

  return (
    <section className="flex flex-col w-full light:text-foreground mb-5 px-8">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8 flex justify-center"
        >
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
                      {...field}
                    />
                    <Search
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
      <div className="mt-2">
        <SearchFilters />
      </div>
    </section>
  );
}
