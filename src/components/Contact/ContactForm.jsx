import emailjs from '@emailjs/browser';

import { useToast } from '@/components/ui/use-toast';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/Form';

const contactFormSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  subject: z.string(),
  message: z.string(),
});


export default function ContactForm() {
  const { toast } = useToast();


  // define the form
  const initialFormState = {
    name: '',
    email: '',
    subject: '',
    message: '',
  };

  const form = useForm({
    resolver: zodResolver(contactFormSchema),
    defaultValues: initialFormState
  });


  // send email with user inputted data using emailjs
  const serviceID = 'service_p2hlq4k'
  const testmplateID = 'template_contactRequest'
  const publicKey = 'mU9AJxqdfYVzs73wC'

  const onSubmit = (emailData) => {
    emailjs.send(serviceID, testmplateID, emailData, publicKey)
      .then(() => {
        console.log('SUCCESS!');
        form.reset(initialFormState);
        toast({
            title: 'Message sent',
            description: 'Your message has been successfully sent.',
        });
      })
      .catch((error) => {
        console.log('FAILED...', error.text);
        toast({
            variant: 'destructive',
            title: 'Uh oh! Something went wrong.',
            description:
              'There was a problem sending your message. Please try again later.',
          });
      })
  }


  return (
    <section className="flex flex-col w-full bg-white p-6 border-2 rounded-lg border-gray-300 dark:border-gray-800 dark:bg-transparent light: text-foreground">
      <h2 className="pb-2 text-4xl font-bold italic text-primary">Contact Request</h2>
      <Form {...form} className="flex justify-center">
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">

          <div className="flex gap-5 w-full justify-between">
            <div className="flex-grow">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input type="string" placeholder="Enter your name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>      
            <div className="flex-grow">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="string" placeholder="example@gmail.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />  
            </div>
          </div>

          <FormField
            control={form.control}
            name="subject"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Subject</FormLabel>
                <FormControl>
                  <Input type="string" placeholder="message subject" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />  

          <FormField
            control={form.control}
            name="message"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Message</FormLabel>
                <FormControl>
                  <Input type="text" multiline={true} className="text-left h-40 w-full" placeholder="message" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex justify-center">
            <Button type="submit">Submit</Button>
          </div>
        </form>
      </Form>
    </section>
  );
};
