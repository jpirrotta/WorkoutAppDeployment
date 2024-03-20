import Attribution from '@/components/Attribution.jsx';
import Image from 'next/image';
// Icon(s)
import QuotationIcon from '@/components/svgs/QuotationIcon.svg';
// Icon maker
import { StyledIcon } from '../StyledIcon';

export default function Testimonial({
  src,
  name,
  type,
  desc,
  author,
  attributeSource,
}) {
  // == all of this is done to show the Icon at the end of the desc ==
  const words = desc.split(' ');
  const lastWord = words.pop();
  const textWithoutLastWord = words.join(' ');
  // =================================================================
  return (
    <div className="flex flex-col justify-center items-center text-center text-balance">
      <Image
        className="mx-auto shadow-lg shadow-primary w-[70%] h-[35%] sm:w-[60%] lg:w-[30%] m-3 rounded-full"
        src={src}
        alt="gym goer"
        width={450}
        height={450}
        quality={100}
        placeholder="blur"
      />
      {author && attributeSource && (
        <Attribution
          author={author}
          attributeSource={attributeSource}
          type="Image"
        />
      )}

      <div className="w-full px-3 lg:w-8/12 flex-shrink-0 flex-grow-0">
        <h5 className="my-2 text-lg text-primary font-bold">{name}</h5>
        {type && (
          <p className="mb-2 font-medium text-secondary text-secondary-foreground">
            {type}
          </p>
        )}
        <p className="text-muted-foreground w-[80%] mx-auto">
          {textWithoutLastWord + ' '}
          <span className="inline-flex items-baseline">
            {lastWord}
            <StyledIcon Icon={QuotationIcon} w={22} className="text-primary"/>
          </span>
        </p>
      </div>
    </div>
  );
}
