import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

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


const contactFormSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  subject: z.string(),
  message: z.string(),
});


export default function ContactForm() {
  // define the form
  const form = useForm({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: 'John Doe',
      email: 'johnDoe@mail.com',
      subject: 'enter message subject here',
      message: 'enter message here',
    },
  });


  // handle form submission
  const onSubmit = (data) => {
    console.log("form submitted")
    console.log(data);
  };


  return (
    <section className="flex flex-col w-full">
      <h2 className="pb-2 text-4xl font-bold italic text-primary">Contact Request</h2>
      <Form {...form} className="flex justify-center">
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">

          <div className="flex gap-5 w-full justify-between">
            <div className="flex-grow">
              <FormField
                control={form.control}
                name="contact.name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input type="string" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>      
            <div className="flex-grow">
              <FormField
                control={form.control}
                name="contact.email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="string" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />  
            </div>
          </div>

          <FormField
            control={form.control}
            name="contact.subject"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Subject</FormLabel>
                <FormControl>
                  <Input type="string" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />  

          <FormField
            control={form.control}
            name="contact.message"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Message</FormLabel>
                <FormControl>
                  <Input type="string" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex justify-center md:justify-start">
            <Button type="submit">Submit</Button>
          </div>
        </form>
      </Form>
    </section>
  );
};
