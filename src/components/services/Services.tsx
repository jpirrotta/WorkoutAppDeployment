import ServiceItem from '@/components/services/ServiceItem';
// Icons
import { Scale, Dumbbell, BicepsFlexed } from 'lucide-react';

// Icon Maker
import { StyledIcon } from '@/components/StyledIcon';

// ================================================================
export default function Services() {
  return (
    <section
      id="services"
      className="text-secondary-foreground bg-background w-full"
    >
      <div className="container px-5 py-24 mx-auto">
        <ServiceItem
          svg={
            <StyledIcon
              Icon={Dumbbell}
              w={'80%'}
              className="text-primary"
            />
          }
          title="Customize Your Fitness Journey"
          description="Experience the freedom of creating your own workout plans with our user-friendly workout builder. Enjoy advanced features like supersets, rest times, and more to tailor your workouts to your needs."
          linkText="Start Building Now"
          linkHref="/" // temporary
        />
        <ServiceItem
          svg={
            <StyledIcon
              Icon={BicepsFlexed}
              w={'80%'}
              className="-translate-y-1/4 text-primary"
            />
          }
          title="Discover Our Exercise Library"
          description="Dive into our extensive library of over 1300 exercises. Use our advanced search tool to find the perfect exercise for you. Save your favorites for easy access and learn how to perform each exercise with detailed instructions and animations."
          linkText="Explore Exercises"
          linkHref="/exercises" // temporary
          author="GameIcons"
          attributeSource="https://game-icons.net/"
          reverse
        />
        <ServiceItem
          svg={<StyledIcon Icon={Scale} w={'60%'} className="text-primary" />}
          title="Track Your Health with Ease"
          description="Utilize our variety of easy-to-use health calculators, including BMI, BMR, Diet, and Calorie calculators. Keep track of your health and progress effortlessly."
          linkText="Calculate Now"
          linkHref="/" // temporary
          author="fontawesome"
          attributeSource="https://fontawesome.com/"
        />
      </div>
    </section>
  );
}
