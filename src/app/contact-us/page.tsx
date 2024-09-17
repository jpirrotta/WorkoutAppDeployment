'use client';
import ContactForm from '@/components/contact/ContactForm';
import { ContentLayout } from '@/components/user-panel/content-layout';
import { useUser } from '@clerk/clerk-react';

export default function Contact() {
  const { isSignedIn } = useUser();

  if (isSignedIn) {
    return (
      <ContentLayout title="Contact Us">
        <ContactForm />
      </ContentLayout>
    );
  }

  return (
    <section className="flex min-h-screen flex-col items-center justify-between p-24">
      <ContactForm />
    </section>
  );
}
