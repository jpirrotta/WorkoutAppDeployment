import emailjs from '@emailjs/browser';
import { toast } from 'sonner';
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
const required_error = "This field is required";
const contactFormSchema = z.object({
  name: z
    .string()
    .min(1, {message: required_error})
    .max(40, "Name must be less than 40 characters"),
  email: z.string().email(),
  subject: z
    .string()
    .min(1, {message: required_error})
    .max(150, "Subject must be less than 150 characters")
    .regex(/.*[a-zA-Z]+.*/, "Subject must contain letters"),
  message: z
    .string()
    .min(1, {message: required_error})
    .max(1000, "Message must be less than 1000 characters")
    .regex(/.*[a-zA-Z]+.*/, "Message must contain letters")
});

// Define the form data type
type ContactFormData = z.infer<typeof contactFormSchema>;

export default function ContactForm() {
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
        toast.success('Message sent', {
          description: 'Your message has been successfully sent.',
        });
      })
      .catch((error: Error) => {
        console.log('FAILED...', error.message || error);
        toast.error('Something went wrong.', {
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
          <div className="flex flex-col gap-5 w-full justify-between">
            
            <div className="flex gap-5 w-full justify-between">
              <div className="flex-grow">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input placeholder="First and last name" {...field} />
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
                    <Input type="text" placeholder="Message header" {...field} />
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
                      placeholder="Write your message"
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

          </div>
        </form>
      </Form>
    </section>
  );
}
