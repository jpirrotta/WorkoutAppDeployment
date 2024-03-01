import { buttonVariants } from '@/components/ui/button';
import Link from 'next/link';

export default function Attribution({ attributeSource, author, type, ...props }) {
  return (
    <p className="text-[10px] leading-none pl-2 pt-2" {...props}>
      {type} made by
      <Link
        target="_blank"
        href={attributeSource}
        className={`${buttonVariants({ variant: 'link', size: 'xs', className: 'text-[10px] leading-none pl-1' })}`}
      >
        {author}
      </Link>
    </p>
  );
}
