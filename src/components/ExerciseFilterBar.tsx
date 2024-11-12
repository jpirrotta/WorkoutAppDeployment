import React from 'react';
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectLabel,
    SelectValue,
} from "@/components/ui/select"
import { Exercise, ExerciseFilters } from '@/types';
import { Badge } from './ui/badge';
import { XCircle } from 'lucide-react';

interface ExerciseFilterBarProps {
    exercises: Exercise[];
    filters: ExerciseFilters;
    onFilterChange: (filters: ExerciseFilters) => void;
    showFilters: boolean;
}

export function ExerciseFilterBar({
    exercises = [],
    filters = {
        bodyPart: [],
        target: [],
        equipment: [],
        secondaryMuscles: []
    },
    onFilterChange,
    showFilters
}: ExerciseFilterBarProps) {
    const uniqueBodyParts = Array.from(new Set(exercises.map(ex => ex.bodyPart)));
    const uniqueTargets = Array.from(new Set(exercises.map(ex => ex.target)));
    const uniqueEquipment = Array.from(new Set(exercises.map(ex => ex.equipment)));
    const uniqueSecondaryMuscles = Array.from(new Set(exercises.flatMap(ex => ex.secondaryMuscles)));

    const handleFilterSelect = (type: keyof ExerciseFilters, value: string) => {
        const currentFilters = filters[type] || [];
        const newFilters = currentFilters.includes(value)
            ? currentFilters.filter(f => f !== value)
            : [...currentFilters, value];

        onFilterChange({
            ...filters,
            [type]: newFilters
        });
    };

    const handleRemoveFilter = (type: keyof ExerciseFilters, value: string) => {
        const currentFilters = filters[type] || [];
        onFilterChange({
            ...filters,
            [type]: currentFilters.filter(f => f !== value)
        });
    };

    const FilterSelect = ({
        type,
        label,
        items
    }: {
        type: keyof ExerciseFilters,
        label: string,
        items: string[]
    }) => (
        <Select onValueChange={(value) => handleFilterSelect(type, value)}>
            <SelectTrigger className="w-full">
                <SelectValue placeholder={label} />
            </SelectTrigger>
            <SelectContent>
                <SelectGroup>
                    <SelectLabel>{label}</SelectLabel>
                    {items.map((item) => (
                        <SelectItem key={item} value={item}>
                            {item}
                        </SelectItem>
                    ))}
                </SelectGroup>
            </SelectContent>
        </Select>
    );

    return (
        <section className="flex flex-col items-center w-full px-8 py-4 space-y-4">
            {showFilters && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full max-w-[calc(100%-2rem)]">
                    <FilterSelect
                        type="bodyPart"
                        label="Select Body Part"
                        items={uniqueBodyParts}
                    />
                    <FilterSelect
                        type="target"
                        label="Select Target Muscle"
                        items={uniqueTargets}
                    />
                    <FilterSelect
                        type="equipment"
                        label="Select Equipment"
                        items={uniqueEquipment}
                    />
                    <FilterSelect
                        type="secondaryMuscles"
                        label="Select Secondary Muscles"
                        items={uniqueSecondaryMuscles}
                    />
                </div>
            )}

            <div className="flex flex-wrap gap-2">
                {Object.entries(filters).map(([type, values]) =>
                    values && values.map((value: string) => (
                        <Badge key={`${type}-${value}`} variant="secondary">
                            {value}
                            <XCircle
                                className="ml-2 h-4 w-4 cursor-pointer"
                                onClick={() => handleRemoveFilter(type as keyof ExerciseFilters, value)}
                            />
                        </Badge>
                    ))
                )}
            </div>
        </section>
    );
}