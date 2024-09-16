import LandingPage from '@/components/LandingPage';
import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';

export default function Home() {
  const { userId } = auth();

  if (userId) {
    return redirect('/dashboard');
  }

  return (
      <LandingPage />
  );
}
