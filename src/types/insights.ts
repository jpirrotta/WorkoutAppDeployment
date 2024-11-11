import { MetricHistory, Profile } from './user';
import { WorkoutHistory } from './workout';

export type Insights = {
  profile: Profile;
  weightHistory: MetricHistory[];
  bodyFatHistory: MetricHistory[];
  workoutHistory: WorkoutHistory[];
};
