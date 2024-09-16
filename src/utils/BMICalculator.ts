// src/utils/BMICalculator.ts

export const calculateBMI = (weight: number, height: number): number => {
  // Convert height from cm to m
  const heightInMeters = height / 100;

  // Calculate BMI using the metric formula: BMI = weight (kg) / height (m)²
  const bmi = weight / heightInMeters ** 2;

  return Math.round(bmi * 10) / 10; // Rounded to 1 decimal place using Math.round
};

export const getBMICategory = (bmi: number): string => {
  if (bmi < 18.5) {
    return 'Underweight';
  } else if (bmi >= 18.5 && bmi <= 24.9) {
    return 'Normal weight';
  } else if (bmi >= 25 && bmi <= 29.9) {
    return 'Overweight';
  } else {
    return 'Obese';
  }
};
