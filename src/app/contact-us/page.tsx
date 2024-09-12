'use client';
import ContactForm from '@/components/contact/ContactForm';

// TODO check if this page need 'use client'
export default function Contact() {
  return (
    <section className="flex min-h-screen flex-col items-center justify-between p-24">
      <ContactForm />
    </section>
  );
}
