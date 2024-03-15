

export default function calculateBMI(weight, height, system) {
  // Validate input
  if (typeof weight !== 'number' || typeof height !== 'number') {
      return 'Invalid input. Weight and height must be numeric values.';
  }

  let bmi;
  if (system === 'imperial') {
      // Convert inches to meters
      const heightMeters = height * 0.0254;
      // Calculate BMI using the imperial formula: BMI = weight (lbs) / height (in²) × 703
      bmi = (weight / (heightMeters ** 2)) * 703;
  } else if (system === 'metric') {
      // Calculate BMI using the metric formula: BMI = weight (kg) / height (m)²
      bmi = weight / (height ** 2);
  } else {
      return 'Invalid system. Choose either "imperial" or "metric".';
  }

  return bmi.toFixed(1); // Rounded to 2 decimal places
}