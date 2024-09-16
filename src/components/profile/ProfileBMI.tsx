import ProfileBMIAlert from '@/components/profile/ProfileBMIAlert';
import BMICard from '@/components/calculators/BMICard';

type ProfileBMIProps = Readonly<{
  weight: number | undefined;
  height: number | undefined;
}>;

export default function ProfileBMI({ weight, height }: ProfileBMIProps) {
  if (!weight || !height) {
    return <ProfileBMIAlert />;
  }

  return <BMICard weight={weight} height={height} />;
}
