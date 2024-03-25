'use client';

import { useAuth } from "@clerk/nextjs";

import Hero from '@/components/Hero.jsx';
import Services from '@/components/Services/Services';
import CallToActionSection from '@/components/CallToActionSection';
import Testimonials from '@/components/Testimonials/Testimonials';
import SocialFeed from '@/components/SocialFeed/SocialFeed';

export default function Home() {
  const { isSignedIn } = useAuth();

  return (
    <div>

      { isSignedIn ? (
        <SocialFeed />
      ) : (
        <main className="flex flex-col items-center justify-between">
          <Hero />
          <Services />
          <CallToActionSection
            title="Ready To Start Your Fitness Journey ?"
            text="Join our community and start tracking your workouts, sharing your routines, and learning together."
            buttonText="Sign Up"
            buttonLink="/sign-up"
          />
          <Testimonials />
          </main>
      )}

    </div>
  );
}
