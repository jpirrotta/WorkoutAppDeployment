export * from './user';
export * from './workout';

//exercise filters
export interface ExerciseFilters {
    bodyPart?: string[];
    target?: string[];
    equipment?: string[];
    secondaryMuscles?: string[];
}

export * from './insights';
