import WeightFatBarChart from '@/components/dashboard-charts/WeightFatBarChart';
import TotalExercisesPieChart from '@/components/dashboard-charts/TotalExercisesPieChart';
export default function Dashboard() {
  return (
    <div>
      <div className="flex flex-col xl:flex-row gap-2 justify-center">
        <TotalExercisesPieChart />
        <WeightFatBarChart />
      </div>
    </div>
  );
}
