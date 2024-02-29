import Hero from '@/components/Hero/Hero.jsx';
import Services from '@/components/Services/Services';

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-between">
      <Hero />
      <Services />
    </main>
  );
}
