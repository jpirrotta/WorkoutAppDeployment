'use client';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { profileFormSchema } from '@/models/ProfileFormSchema';

const formSchema = z.object({
  email: z.string().email(),
});

export const FooterNewsLetterSignUp = () => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
  }

  return (
    <>
      <h4 className="uppercase text-indigoTouch font-bold">
        FitConnect Newsletter
      </h4>
      <p>
        Sign up for our newsletter to get the latest fitness news and updates.
      </p>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem className="mx-12">
                <FormLabel></FormLabel>
                <FormControl>
                  <Input placeholder="eg. stayfit@email.com" {...field} />
                </FormControl>
                <FormDescription className="text-secondary">
                  We will never share your email with anyone else.
                </FormDescription>
                <FormMessage className=" text-indigoTouch" />
              </FormItem>
            )}
          />
          <Button variant="secondary" type="submit">
            Submit
          </Button>
        </form>
      </Form>
    </>
  );
};
