import { buttonVariants } from '@/components/ui/button.jsx';
import Link from 'next/link';

export default function Attribution({
  attributeSource,
  author,
  type,
  ...props
}) {
  return (
    <p className="text-[9px] sm:text-[10px] leading-none pl-2 pt-2" {...props}>
      {type} made by
      <Link
        target="_blank"
        href={attributeSource}
        className={`${buttonVariants({ variant: 'link', size: 'xxs', className: 'text-[8px] leading-none pl-1' })} `}
      >
        {author}
      </Link>
    </p>
  );
}
