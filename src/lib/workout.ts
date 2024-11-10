import {
  Exercise,
  FlatSets,
  Sets,
  WorkoutHistory,
  ExerciseHistory,
} from '@/types';

/**
 * Flattens the nested sets structure into a flat array of sets.
 * Each set is repeated according to its `sets` property.
 *
 * @param {Sets} nestedSets - The nested sets structure to flatten.
 * @returns {FlatSets} - The flattened array of sets.
 */
export const flattenSets = (nestedSets: Sets): FlatSets => {
  const flatSets: FlatSets = [];

  nestedSets.forEach((set) => {
    // Repeat for the number of sets
    for (let i = 0; i < set.sets; i++) {
      flatSets.push({
        reps: set.reps,
        weight: set.weight,
      });
    }
  });

  return flatSets;
};

/**
 * Reconstructs the nested sets structure from a flat array of sets.
 * Groups sets by their `reps` and `weight` properties and counts the occurrences.
 *
 * @param {FlatSets} flatSets - The flat array of sets to reconstruct.
 * @returns {Sets} - The reconstructed nested sets structure.
 */
export const reconstructSets = (flatSets: FlatSets): Sets => {
  const groupedSets = flatSets.reduce((acc, curr) => {
    const key = `${curr.reps}-${curr.weight}`;
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return Object.entries(groupedSets).map(([key, count]) => {
    const [reps, weight] = key.split('-').map(Number);
    return {
      sets: count,
      reps,
      weight,
    };
  });
};

/**
 * Compares two sets arrays to check if they are equal.
 * @param originalSets - The original sets array.
 * @param formSets - The form sets array.
 * @returns True if the sets are equal, false otherwise.
 */
function areSetsEqual(originalSets: Sets, formSets: Sets): boolean {
  if (originalSets.length !== formSets.length) {
    return false;
  }

  for (let i = 0; i < originalSets.length; i++) {
    const originalSet = originalSets[i];
    const formSet = formSets[i];

    if (
      originalSet.sets !== formSet.sets ||
      originalSet.reps !== formSet.reps ||
      originalSet.weight !== formSet.weight
    ) {
      return false;
    }
  }

  return true;
}

/**
 * Compares the form values with the original workout values and returns the set of _id's where the values have changed.
 * @param originalExercises - The original exercises from the workout.
 * @param formValues - The form values from the user input.
 * @returns A set of _id's where the values have changed.
 */
export function getChangedExerciseIds(
  originalExercises: Exercise[],
  formValues: Record<string, Sets>
): Set<string> {
  const changedIds = new Set<string>();

  for (const exercise of originalExercises) {
    const originalSets = exercise.sets;
    const formSets = formValues[exercise._id!.toString()];

    if (!formSets) {
      continue;
    }

    if (!areSetsEqual(originalSets, formSets)) {
      changedIds.add(exercise._id!.toString());
    }
  }

  return changedIds;
}

/**
 * Compares the form values with the original workout values and returns true if there are any changes.
 * @param originalExercises - The original exercises from the workout.
 * @param formValues - The form values from the user input.
 * @returns True if there are any changes, false otherwise.
 */
export function hasExerciseChanges(
  originalExercises: Exercise[],
  formValues: Record<string, Sets>
): boolean {
  for (const exercise of originalExercises) {
    const originalSets = exercise.sets;
    const formSets = formValues[exercise._id!.toString()];

    if (!formSets) {
      continue;
    }

    if (!areSetsEqual(originalSets, formSets)) {
      return true;
    }
  }

  return false;
}
export function collectWorkoutHistoryData(
  workout: {
    _id: string;
    name: string;
    exercises: Exercise[];
  },
  exerciseStates: Record<
    string,
    {
      numberOfSets: number;
      completedSets: (boolean | undefined)[];
    }
  >,
  exerciseFormValues: Record<string, Sets>,
  duration: number
): WorkoutHistory {
  const completedExercises = Object.values(exerciseStates).filter((state) =>
    state.completedSets.every((set) => set !== undefined)
  ).length;

  const exercises: ExerciseHistory[] = workout.exercises.map((exercise) => {
    const exerciseId = exercise._id!.toString();
    const completedSets = exerciseStates[exerciseId]?.completedSets || [];
    const formSets = exerciseFormValues[exerciseId] || [];

    // Flatten sets into individual entries
    const flattenedSets = flattenSets(formSets);

    // Filter only completed sets
    const completedFlatSets = flattenedSets.filter(
      (_, index) =>
        completedSets[Math.floor(index / formSets[0]?.sets || 1)] === true
    );

    // Reconstruct sets with counts
    const processedSets = reconstructSets(completedFlatSets);

    return {
      name: exercise.name,
      primaryMuscle: exercise.target,
      sets: processedSets,
    };
  });

  return {
    name: workout.name,
    date: new Date(),
    duration,
    completedExercises,
    totalExercises: workout.exercises.length,
    exercises,
  };
}
