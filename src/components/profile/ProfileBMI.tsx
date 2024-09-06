import ProfileBMIAlert from '@/components/profile/ProfileBMIAlert';
import BMICard from '@/components/BMICard';

type ProfileBMIProps = Readonly<{
  weight: string;
  height: string;
}>;

export default function ProfileBMI({ weight, height }: ProfileBMIProps) {
  if (!weight || !height) {
    return <ProfileBMIAlert />;
  }

  return <BMICard weight={weight} height={height} />;
}
