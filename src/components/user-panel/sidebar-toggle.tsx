'use client';

import { ChevronLeft } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { sidebarToggleAtom } from '@/store';
import { useAtom } from 'jotai';
interface SidebarToggleProps {
  isOpen: boolean;
  setIsOpen: () => void;
}

export function SidebarToggle() {
  const [isOpen, setIsOpen] = useAtom(sidebarToggleAtom);
  return (
    <div className="invisible lg:visible absolute top-[12px] -right-[16px] z-20">
      <Button
        onClick={() => setIsOpen((prev) => !prev)}
        className="rounded-md w-8 h-8 bg-background"
        variant="outline"
        size="icon"
      >
        <ChevronLeft
          className={cn(
            'h-4 w-4 transition-transform ease-in-out duration-700',
            isOpen === false ? 'rotate-180' : 'rotate-0'
          )}
        />
      </Button>
    </div>
  );
}
