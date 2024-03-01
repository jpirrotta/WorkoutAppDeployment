import Spotlight from '@/components/ui/Spotlight';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import ArrowCloseDownIcon from '@/components/svgs/ArrowCloseDownIcon.svg';
export default function Hero() {
  return (
    // consider adding overflow-hidden to that the spotlight doesn't overflow to the header
    <div className="h-[50rem] 3xl:h-[55rem] items-center w-full flex md:items-center md:justify-center bg-slate-900 antialiased bg-grid-rose/[0.02] relative">
      <Spotlight
        className="-top-20 md:-top-20 lg:-top-10 xl:-top-5 2xl:-top-0 3xl:-top-0 left-20 md:left-60 lg:left-80 xl:left-96 2xl:left-[30rem] 3xl:left-[50rem]"
        fill="#fb7185"
      />
      <div className=" p-4 max-w-7xl  mx-auto relative z-10  w-full pt-20 md:pt-0">
        <h1 className="text-4xl md:text-7xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-b from-rose-50 to-rose-400 bg-opacity-50">
          Join Our Fitness
          <br />
          Community.
        </h1>
        <p className="mt-4 font-normal text-base text-primary-foreground max-w-lg text-center mx-auto">
          Track Workouts, Share Routines, and Learn Together.
        </p>
        <div className="flex justify-center mt-8">
          <Link href="/sign-up" scroll={false}>
            <Button size="lg" variant="outline">
              Start Your Fitness Journey Today
            </Button>
          </Link>
        </div>
      </div>
      <Link href="#services">
        <ArrowCloseDownIcon className="absolute bottom-4 left-1/2 transform -translate-x-1/2 w-12 h-12 text-primary" />
      </Link>
    </div>
  );
}
