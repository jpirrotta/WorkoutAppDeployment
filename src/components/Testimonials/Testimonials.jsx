import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import Testimonial from '@/components/Testimonials/Testimonial';

import testimonialImage1 from '@/assets/images/testimonials1.jpg';
import testimonialImage2 from '@/assets/images/testimonials2.jpg';
import testimonialImage3 from '@/assets/images/testimonials3.jpg';

const testimonials = [
  {
    src: testimonialImage3,
    name: 'Arnold Schwarzenegger',
    type: 'Professional Trainer',
    desc: "As a professional trainer, I've seen many workout apps, but this one stands out. The custom workout builder is a game-changer, allowing my clients to tailor their workouts to their needs. The progress tracker keeps them motivated and accountable. I highly recommend this app to anyone serious about fitness",
    author: 'Total Shape',
    attributeSource:
      'https://unsplash.com/photos/man-in-black-tank-top-and-black-shorts-TY_Ce5d2G-k?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash',
  },
  {
    src: testimonialImage2,
    name: 'Ragnar Lothbrok',
    type: 'Gym Enthusiast',
    desc: "This app has taken my gym routine to the next level. The extensive library of exercises ensures I never run out of options. The advanced search tool helps me find the perfect exercise for each muscle group. It's like having a personal trainer in my pocket.",
    author: 'Anastase Maragos',
    attributeSource:
      'https://unsplash.com/photos/topless-man-in-black-pants-holding-black-and-yellow-exercise-equipment-fG0p4Qh_aWI?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash',
  },
  {
    src: testimonialImage1,
    name: 'Wonder Woman',
    type: 'Indoor & Outdoor Fitness Lover',
    desc: "I love the flexibility this app offers. Whether I'm working out at home or outside, I have a variety of exercises at my fingertips. The health calculators are super helpful for tracking my progress. It's everything I need in a fitness app",
    author: 'Alora Griffiths',
    attributeSource:
      'https://unsplash.com/photos/woman-seriously-performing-gym-exercise-LOnMc8Rp1Qs?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash',
  },
];

export default function Testimonials() {
  return (
    <div className="bg-slate-900 p-10 w-full pt-16 ">
      <Carousel className="bg-slate-900 mx-5 sm:mx-10 md:mx-20 3xl:mx-[30rem] text-slate-400">
        <CarouselContent>
          {testimonials.map((testimonial) => (
            <CarouselItem key={testimonial.name}>
              <Testimonial
                src={testimonial.src}
                name={testimonial.name}
                type={testimonial.type}
                desc={testimonial.desc}
                author={testimonial.author}
                attributeSource={testimonial.attributeSource}
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
