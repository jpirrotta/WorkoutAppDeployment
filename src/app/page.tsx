import LandingPage from '@/components/LandingPage';
import { auth } from '@clerk/nextjs/server';
import AdminPanelLayout from '@/components/user-panel/admin-panel-layout';

export default function Home() {
  const { userId } = auth();

  if (userId) {
    return (
      <AdminPanelLayout>
        <LandingPage />
      </AdminPanelLayout>
    );
  }

  return (
    <main className="flex flex-col items-center justify-between">
      <LandingPage />
    </main>
  );
}
