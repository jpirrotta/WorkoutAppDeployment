import Attribution from '@/components/Attribution';
import Image, { StaticImageData } from 'next/image';
// Icon(s)
import { Quote } from 'lucide-react';
// Icon maker
import { StyledIcon } from '../StyledIcon';

type TestimonialProps = Readonly<{
  src: StaticImageData;
  name: string;
  type: string;
  desc: string;
  author?: string;
  attributeSource?: string;
}>;

export default function Testimonial({
  src,
  name,
  type,
  desc,
  author,
  attributeSource,
}: TestimonialProps) {
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
        <p className="my-2 text-lg text-primary font-bold">{name}</p>
        {type && <p className="mb-2 font-medium text-secondary">{type}</p>}
        <p className="text-muted-foreground w-[80%] mx-auto">
          {textWithoutLastWord + ' '}
          <span className="inline-flex items-baseline">
            {lastWord}
            <StyledIcon Icon={Quote} w={'22'} className="text-primary" />
          </span>
        </p>
      </div>
    </div>
  );
}
