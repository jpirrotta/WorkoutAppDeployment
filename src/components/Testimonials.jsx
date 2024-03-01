import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import QuotationIcon from '@/components/svgs/QuotationIcon.svg';
import Image from 'next/image';

const testimonials = [
  {
    src: '/testimonials3.jpg',
    name: 'Arnold Schwarzenegger',
    type: 'Professional Trainer',
    desc: "As a professional trainer, I've seen many workout apps, but this one stands out. The custom workout builder is a game-changer, allowing my clients to tailor their workouts to their needs. The progress tracker keeps them motivated and accountable. I highly recommend this app to anyone serious about fitness",
  },
  {
    src: '/testimonials2.jpg',
    name: 'Aladdin Aladdin',
    type: 'Gym Enthusiast',
    desc: "This app has taken my gym routine to the next level. The extensive library of exercises ensures I never run out of options. The advanced search tool helps me find the perfect exercise for each muscle group. It's like having a personal trainer in my pocket.",
  },
  {
    src: '/testimonials1.jpg',
    name: 'Wonder Woman',
    type: 'Indoor & Outdoor Fitness Lover',
    desc: "I love the flexibility this app offers. Whether I'm working out at home or outside, I have a variety of exercises at my fingertips. The health calculators are super helpful for tracking my progress. It's everything I need in a fitness app",
  },
];

const Testimonial = ({ src, name, type, desc }) => {
  // all of this is done to show the Icon at the end of the desc
  const words = desc.split(' ');
  const lastWord = words.pop();
  const textWithoutLastWord = words.join(' ');
  return (
    <>
      <div>
        <Image
          className="mx-auto mb-6 rounded-full shadow-lg dark:shadow-primary w-[70%] sm:w-[60%] lg:w-[30%]"
          src={src}
          alt="gym goer"
          width={250}
          height={250}
          quality={100}
        />
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
              {textWithoutLastWord}{' '}
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

export default function Testimonials() {
  return (
    <div className="bg-slate-900 p-10 w-full pt-20 ">
      <Carousel className="bg-slate-900 mx-5 sm:mx-10 md:mx-20 3xl:mx-[30rem]">
        <CarouselContent>
          {testimonials.map((testimonial) => (
            <CarouselItem key={testimonial.name}>
              <Testimonial
                src={testimonial.src}
                name={testimonial.name}
                type={testimonial.type}
                desc={testimonial.desc}
              />
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </div>
  );
}
