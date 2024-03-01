import Hero from '@/components/Hero.jsx';
import Services from '@/components/Services/Services';
import CallToActionSection from '@/components/CallToActionSection';
import Testimonials from '@/components/Testimonials/Testimonials';

export default function Home() {
  return (
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
  );
}
