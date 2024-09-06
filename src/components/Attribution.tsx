import { buttonVariants } from '@/components/ui/button';
import Link from 'next/link';
import { HTMLAttributes } from 'react';

interface AttributionProps extends HTMLAttributes<HTMLParagraphElement> {
  readonly attributeSource: string;
  readonly author: string;
  readonly type: string;
}

export default function Attribution({
  attributeSource,
  author,
  type,
  ...props
}: AttributionProps) {
  return (
    <p className="text-[9px] sm:text-[10px] leading-none pl-2 pt-2" {...props}>
      {type} made by
      <Link
        target="_blank"
        href={attributeSource}
        className={`${buttonVariants({
          variant: 'link',
          size: 'xxs',
          className: 'text-[8px] leading-none pl-1',
        })} `}
      >
        {author}
      </Link>
    </p>
  );
}
