import Hero from '@/components/Hero';
import Services from '@/components/services/Services';
import CallToActionSection from '@/components/CallToActionSection';
import Testimonials from '@/components/Testimonials/Testimonials';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';

export default function LandingPage() {
  return (
    <main className="flex flex-col items-center justify-between">
      <Header />
      <Hero />
      <Services />
      <CallToActionSection
        title="Ready To Start Your Fitness Journey ?"
        text="Join our community and start tracking your workouts, sharing your routines, and learning together."
        buttonText="Sign Up"
        buttonLink="/sign-up"
      />
      <Testimonials />
      <Footer />
    </main>
  );
}
