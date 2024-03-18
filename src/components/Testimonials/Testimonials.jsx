import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/Carousel';
import Testimonial from '@/components/Testimonials/Testimonial';
import testimonialsList from '@/data/testimonialsList';

export default function Testimonials() {
  return (
    <div className="bg-background p-10 w-full pt-16 ">
      <Carousel className="bg-background mx-5 sm:mx-10 md:mx-20 3xl:mx-[30rem] text-secondary-foreground">
        <CarouselContent>
          {testimonialsList.map((testimonial) => (
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
