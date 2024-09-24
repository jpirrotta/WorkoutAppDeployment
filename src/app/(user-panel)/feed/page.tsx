import { ContentLayout } from '@/components/user-panel/content-layout';
import SocialFeed from '@/components/social-feed/SocialFeed';


export default function Feed() {
  return (
    <ContentLayout title="Feed">
      <h1>Feed</h1>
      <SocialFeed />
    </ContentLayout>
  );
}
