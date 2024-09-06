// src/utils/BMICalculator.ts
import logger from '../lib/logger';

export const calculateBMI = (weight: string, height: string): string => {
  // Convert inputs to numbers
  const weightNum = parseFloat(weight);
  const heightNum = parseFloat(height);

  // Validate input
  if (isNaN(weightNum) || isNaN(heightNum)) {
    logger.error('Invalid input. Weight and height must be numeric values.');
    return 'Invalid input. Weight and height must be numeric values.';
  }

  // Convert height from cm to m
  const heightInMeters = heightNum / 100;

  // Calculate BMI using the metric formula: BMI = weight (kg) / height (m)²
  const bmi = weightNum / heightInMeters ** 2;

  return bmi.toFixed(1); // Rounded to 1 decimal place
};

export const getBMICategory = (bmi: string): string => {
  const bmiNum = parseFloat(bmi);
  if (bmiNum < 18.5) {
    return 'Underweight';
  } else if (bmiNum >= 18.5 && bmiNum <= 24.9) {
    return 'Normal weight';
  } else if (bmiNum >= 25 && bmiNum <= 29.9) {
    return 'Overweight';
  } else {
    return 'Obese';
  }
};
