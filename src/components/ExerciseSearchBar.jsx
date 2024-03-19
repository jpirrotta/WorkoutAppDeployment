import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Input } from '@/components/ui/Input';
import MagnifyingGlass from '@/components/svgs/MagnifyingGlass.svg';
import SearchFilters from '@/components/SearchFilters';

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

export default function ExercisesSearchBar() {
  const form = useForm({ resolver: zodResolver(searchBarFormSchema) });

  const onSubmit = (data) => {
    console.log(data);
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
      <div className="mt-2">
        <SearchFilters />
      </div>
    </section>
  );
}
