import Profile from '@/components/profile/ProfileForm';
import { ContentLayout } from '@/components/user-panel/content-layout';

export default function UserProfilePage() {
  return (
    <ContentLayout title="Profile">
      <Profile />
    </ContentLayout>
  );
}
