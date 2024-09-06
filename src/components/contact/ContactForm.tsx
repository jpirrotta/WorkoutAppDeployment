import emailjs from '@emailjs/browser';
import { useToast } from '@/hooks/use-toast';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, SubmitHandler } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';

// Define the schema using zod
const contactFormSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  subject: z.string(),
  message: z.string(),
});

// Define the form data type
type ContactFormData = z.infer<typeof contactFormSchema>;

export default function ContactForm() {
  const { toast } = useToast();

  // Define the form
  const initialFormState: ContactFormData = {
    name: '',
    email: '',
    subject: '',
    message: '',
  };

  const form = useForm<ContactFormData>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: initialFormState,
  });

  // Send email with user inputted data using emailjs
  const serviceID = 'service_p2hlq4k';
  const templateID = 'template_contactRequest';
  const publicKey = 'mU9AJxqdfYVzs73wC';

  const onSubmit: SubmitHandler<ContactFormData> = (emailData) => {
    emailjs
      .send(serviceID, templateID, emailData, publicKey)
      .then(() => {
        console.log('SUCCESS!');
        form.reset(initialFormState);
        toast({
          title: 'Message sent',
          description: 'Your message has been successfully sent.',
        });
      })
      .catch((error: Error) => {
        console.log('FAILED...', error.message || error);
        toast({
          variant: 'destructive',
          title: 'Uh oh! Something went wrong.',
          description:
            'There was a problem sending your message. Please try again later.',
        });
      });
  };

  return (
    <section className="flex flex-col w-full bg-white p-6 border-2 rounded-lg border-gray-300 dark:border-gray-800 dark:bg-transparent light: text-foreground">
      <h2 className="pb-2 text-4xl font-bold italic text-primary">
        Contact Request
      </h2>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8 flex justify-center"
        >
          <div className="flex gap-5 w-full justify-between">
            <div className="flex-grow">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Enter your name" {...field} />
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
                      <Input
                        type="email"
                        placeholder="example@gmail.com"
                        {...field}
                      />
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
                  <Input type="text" placeholder="message subject" {...field} />
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
                  <Textarea
                    className="text-left h-40 w-full"
                    placeholder="message"
                    {...field}
                  />
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
}
