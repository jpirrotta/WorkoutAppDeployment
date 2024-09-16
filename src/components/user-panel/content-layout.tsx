import { Navbar } from '@/components/user-panel/navbar';
import { cn } from '@/lib/utils';
interface ContentLayoutProps {
  title: string;
  children: React.ReactNode;
  className?: string;
}

export function ContentLayout({
  title,
  children,
  className,
}: ContentLayoutProps) {
  return (
    <div>
      <Navbar title={title} />
      <div className={cn('container pt-8 pb-8 px-4 sm:px-8 h-full', className)}>
        {children}
      </div>
    </div>
  );
}