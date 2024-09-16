'use client';

import { cn } from '@/lib/utils';
import { Footer } from '@/components/user-panel/footer';
import { Sidebar } from '@/components/user-panel/sidebar';
import { sidebarToggleAtom } from '@/store';
import { useAtomValue } from 'jotai';
import { useHasMounted } from '@/hooks/useHasMounted';

export default function AdminPanelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const sidebarIsOpen = useAtomValue(sidebarToggleAtom);

  const hasMounted = useHasMounted();
  if (!hasMounted) return null;

  return (
    <>
      <Sidebar />
      <main
        className={cn(
          // TODO Change colors to theme colors
          'min-h-[calc(100vh_-_56px)] bg-zinc-50 dark:bg-zinc-900 transition-[margin-left] ease-in-out duration-300',
          !sidebarIsOpen ? 'lg:ml-[90px]' : 'lg:ml-72'
        )}
      >
        {children}
      </main>
      <footer
        className={cn(
          'transition-[margin-left] ease-in-out duration-300',
          !sidebarIsOpen === false ? 'lg:ml-[90px]' : 'lg:ml-72'
        )}
      >
        {/* not used for now  */}
        {/* <Footer /> */}
      </footer>
    </>
  );
}
