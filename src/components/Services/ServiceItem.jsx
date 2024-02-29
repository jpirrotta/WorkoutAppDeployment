import { buttonVariants } from '@/components/ui/button';
import Link from 'next/link';

import RightArrow from '@/components/svgs/RightArrow.svg';
export default function ServiceItem({
  svg,
  title,
  description,
  linkText,
  linkHref,
  reverse,
  iconAuthor,
  iconSource,
}) {
  return (
    <div
      className={`flex items-center lg:w-3/5 mx-auto border-b pb-10 mb-10 border-slate-800 sm:flex-row flex-col ${reverse ? 'sm:flex-row-reverse' : ''}`}
    >
      <div className="sm:w-32 sm:h-32 h-20 w-20 sm:mr-10 inline-flex items-center justify-center rounded-full bg-slate-800 flex-shrink-0 hover:ring-4 hover:ring-primary">
        {' '}
        {svg}
      </div>
      <div className="flex-grow sm:text-left text-center mt-6 sm:mt-0">
        <h2 className="text-white text-lg title-font font-medium mb-2">
          {title}
        </h2>
        <p className="leading-relaxed text-base">{description}</p>

        <Link
          href={linkHref}
          className={`mt-3 inline-flex items-center ${buttonVariants()}`}
        >
          {linkText}
          {/* right arrow icon in JSX! */}
          <RightArrow width={'1.3em'} className="ml-2" />
        </Link>
        {iconAuthor && (
          <p className="text-[0.6rem] pl-2 pt-2">
            Icon made by
            <Link
              target="_blank"
              href={iconSource}
              className={`${buttonVariants({ variant: 'link', size: 'xs', className: 'text-[0.7rem] pl-1' })}`}
            >
              {iconAuthor}
            </Link>
          </p>
        )}
      </div>
    </div>
  );
}
