import WeightFatBarChart from '@/components/dashboard-charts/WeightFatBarChart';
import TotalExercisesPieChart from '@/components/dashboard-charts/TotalExercisesPieChart';
import WorkoutTimeline from '@/components/dashboard-charts/workoutTimeline';
import SocialLikesChart from '@/components/dashboard-charts/SocialLikesChart';
import SocialDownloadsChart from '@/components/dashboard-charts/SocialDownloadsChart';
export default function Dashboard() {
  return (
    <div>
      <WorkoutTimeline />
      <div className="flex flex-col mb-2 xl:flex-row gap-2 justify-center">
        <TotalExercisesPieChart />
        <WeightFatBarChart />
      </div>
      <div className="flex flex-col xl:flex-row gap-2 justify-center">
        <SocialLikesChart />
        <SocialDownloadsChart />
      </div>
    </div>
  );
}