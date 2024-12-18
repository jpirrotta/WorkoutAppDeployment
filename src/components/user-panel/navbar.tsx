import { ThemeToggle } from '@/components/theme-toggle';
import { UserNav } from '@/components/user-panel/user-nav';
import { SheetMenu } from '@/components/user-panel/sheet-menu';

interface NavbarProps {
  title: string;
}

export function Navbar({ title }: NavbarProps) {
  return (
    <header className="sticky top-0 z-10 w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 ">
      <div className="mx-4 sm:mx-8 flex h-14 items-center">
        <div className="flex items-center space-x-4 lg:space-x-0">
          <SheetMenu />
          <h1 className="font-bold">{title}</h1>
        </div>
        <div className="flex flex-1 items-center justify-end">
          <ThemeToggle />
          <UserNav />
        </div>
      </div>
    </header>
  );
}
