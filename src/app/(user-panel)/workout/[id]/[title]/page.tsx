import { ContentLayout } from '@/components/user-panel/content-layout';
import WorkoutPlayer from '@/components/workout/player';
export default function WorkoutPlayerPage({
  params,
}: {
  params: { id: string; title: string };
}) {
  console.log('Params:', params);
  const id = decodeURI(params.id);
  const title = decodeURI(params.title);

  return (
    <ContentLayout title={title}>
      <WorkoutPlayer id={id} />
    </ContentLayout>
  );
}
