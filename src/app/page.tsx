import LandingPage from '@/components/LandingPage';
import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';

export default function Home({ children }: { children: React.ReactNode }) {
  const { userId } = auth();

  if (userId) {
    return redirect('/dashboard');
  }

  return (
    <main className="flex flex-col items-center justify-between">
      <LandingPage />
    </main>
  );
}
