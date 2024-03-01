import ServiceItem from '@/components/Services/ServiceItem';
//icons
import DumbbellIcon from '@/components/svgs/DumbbellIcon.svg';
import WeightLiftingIcon from '@/components/svgs/WeightLiftingIcon.svg';
import WeightScaleIcon from '@/components/svgs/WeightScaleIcon.svg';

// the default style of the icons below is defied in this component
const StyledIcon = ({ Icon, ...props }) => {
  return <Icon width={'80%'} className="text-primary" {...props} />;
};
// ================================================================
export default function Services() {
  return (
    <section id="services" className="text-slate-400 bg-slate-900 w-full">
      <div className="container px-5 py-24 mx-auto">
        <ServiceItem
          svg={<StyledIcon Icon={DumbbellIcon} />}
          title="Customize Your Fitness Journey"
          description="Experience the freedom of creating your own workout plans with our user-friendly workout builder. Enjoy advanced features like supersets, rest times, and more to tailor your workouts to your needs."
          linkText="Start Building Now"
          linkHref="/" // temporary
        />
        <ServiceItem
          svg={
            <StyledIcon
              Icon={WeightLiftingIcon}
              className="-translate-y-1/4 text-primary"
            />
          }
          title="Discover Our Exercise Library"
          description="Dive into our extensive library of over 1300 exercises. Use our advanced search tool to find the perfect exercise for you. Save your favorites for easy access and learn how to perform each exercise with detailed instructions and animations."
          linkText="Explore Exercises"
          linkHref="/" // temporary
          author="GameIcons"
          attributeSource="https://game-icons.net/"
          reverse
        />
        <ServiceItem
          svg={<StyledIcon Icon={WeightScaleIcon} width={'60%'} />}
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
