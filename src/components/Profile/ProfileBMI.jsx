import ProfileBMIAlert from '@/components/Profile/ProfileBMIAlert';
import BMICard from '@/components/BMICard.jsx';

export default function ProfileBMI({ weight, height }) {
  if (!weight || !height) {
    return <ProfileBMIAlert />;
  }

  return <BMICard weight={weight} height={height} />;
}
