import { cn } from '@/lib/utils';

export function Skeleton({ className, ...props }) {
  return (
    <div
      className={cn('animate-pulse rounded-md bg-muted', className)}
      {...props}
    />
  );
}

export function SkeletonCard() {
  return (
    <div className="flex flex-col space-y-3">
      <Skeleton className="h-[125px] w-[250px] rounded-xl" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-[250px]" />
        <Skeleton className="h-4 w-[200px]" />
      </div>
    </div>
  );
}

export function SkeletonCircle() {
  return <Skeleton className="h-12 w-12 rounded-full" />;
}

export function SkeletonLine() {
  return <Skeleton className="h-4 w-[250px]" />;
}

export function SkeletonComment() {
  return (
    <div className="flex space-x-3">
      <SkeletonCircle />
      <div className="flex flex-col space-y-2">
        <SkeletonLine />
        <SkeletonLine />
      </div>
    </div>
  );
}
