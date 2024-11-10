import { Exercise, FlatSets, Sets } from '@/types';

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
