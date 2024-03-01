import Attribution from '@/components/Attribution.jsx';
import QuotationIcon from '@/components/svgs/QuotationIcon.svg';
import Image from 'next/image';

export default function Testimonial ({ src, name, type, desc, author, attributeSource }) {
  // all of this is done to show the Icon at the end of the desc
  const words = desc.split(' ');
  const lastWord = words.pop();
  const textWithoutLastWord = words.join(' ');
  return (
    <>
      <div className="justify-center text-center">
        <Image
          className="mx-auto rounded-full shadow-lg dark:shadow-primary w-[70%] sm:w-[60%] lg:w-[30%]"
          src={src}
          alt="gym goer"
          width={250}
          height={250}
          quality={100}
        />
        {author && attributeSource && (
          <Attribution
            author={author}
            attributeSource={attributeSource}
            type="Image"
          />
        )}
      </div>
      <div className="flex flex-wrap justify-center text-center">
        <div className="w-full px-3 lg:w-8/12 flex-shrink-0 flex-grow-0">
          <h5 className="mb-2 text-lg text-primary font-bold">{name}</h5>
          {type && (
            <p className="mb-4 font-medium text-slate-200 dark:text-slate-400">
              {type}
            </p>
          )}
          <div className="flex justify-center text-center">
            <p className="text-slate-400 dark:text-slate-300">
              {textWithoutLastWord + ' '}
              <span className="inline-flex items-baseline">
                {lastWord}
                <QuotationIcon width={22} className="text-primary" />
              </span>
            </p>
          </div>
        </div>
      </div>
    </>
  );
};
