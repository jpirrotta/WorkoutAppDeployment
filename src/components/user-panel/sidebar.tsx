import Link from 'next/link';
import { Dumbbell } from 'lucide-react';
import { cn } from '@/lib/utils';
import { sidebarToggleAtom } from '@/store';
import { useAtomValue } from 'jotai';
import { Button } from '@/components/ui/button';
import { Menu } from '@/components/user-panel/menu';
import { SidebarToggle } from '@/components/user-panel/sidebar-toggle';
import { useHasMounted } from '@/hooks/useHasMounted';

export function Sidebar() {
  const sidebarIsOpen = useAtomValue(sidebarToggleAtom);

  const hasMounted = useHasMounted();
  if (!hasMounted) return null;

  return (
    <aside
      className={cn(
        'fixed top-0 left-0 z-20 h-screen -translate-x-full lg:translate-x-0 transition-[width] ease-in-out duration-300',
        !sidebarIsOpen ? 'w-[90px]' : 'w-72'
      )}
    >
      <SidebarToggle />
      <div className="relative h-full flex flex-col px-3 py-4 overflow-y-auto shadow-sm shadow-primary/70">
        <Button
          className={cn(
            'transition-transform ease-in-out duration-300 mb-1',
            !sidebarIsOpen ? 'translate-x-1' : 'translate-x-0'
          )}
          variant="link"
          asChild
        >
          <Link href="/dashboard" className="flex items-center gap-2">
            <Dumbbell className="w-6 h-6 mr-1" />
            <h1
              className={cn(
                'font-bold text-lg whitespace-nowrap transition-[transform,opacity,display] ease-in-out duration-300',
                !sidebarIsOpen
                  ? '-translate-x-96 opacity-0 hidden'
                  : 'translate-x-0 opacity-100'
              )}
            >
              FitConnect
            </h1>
          </Link>
        </Button>
        <Menu isOpen={sidebarIsOpen} />
      </div>
    </aside>
  );
}
