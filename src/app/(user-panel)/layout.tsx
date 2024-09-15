import LandingPage from '@/components/LandingPage';
import AdminPanelLayout from '@/components/user-panel/admin-panel-layout';
import { auth } from '@clerk/nextjs/server';
export default function Layout({ children }: { children: React.ReactNode }) {
  const { userId } = auth();

  if (userId) {
    return <AdminPanelLayout>{children}</AdminPanelLayout>;
  }

  return (
    <main className="flex flex-col items-center justify-between">
      <LandingPage />
    </main>
  );
}
