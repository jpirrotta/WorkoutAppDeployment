import { MetricHistory, Profile } from './user';
import { WorkoutHistory } from './workout';

export type Insights = {
  profile: Profile;
  weightHistory: MetricHistory[];
  bodyFatHistory: MetricHistory[];
  workoutHistory: WorkoutHistory[];
};

export type YearDictionary = {
  [key: number]: {
    January: number;
    February: number;
    March: number;
    April: number;
    May: number;
    June: number;
    July: number;
    August: number;
    September: number;
    October: number;
    November: number;
    December: number;
  };
}