export function calculateBMI(weight, height) {
  // Validate input
  if (typeof weight !== 'number' || typeof height !== 'number') {
    console.error('Invalid input. Weight and height must be numeric values.');
    return 'Invalid input. Weight and height must be numeric values.';
  }
  console.log(`calculateBMI: weight: ${weight}, height: ${height}`)

  // Convert height from cm to m
  height = height / 100;

  // Calculate BMI using the metric formula: BMI = weight (kg) / height (m)²
  let bmi = weight / height ** 2;


  return bmi.toFixed(1); // Rounded to 2 decimal places
}

export function getBMICategory(bmi) {
  if (bmi < 18.5) {
    return 'Underweight';
  } else if (bmi >= 18.5 && bmi <= 24.9) {
    return 'Normal weight';
  } else if (bmi >= 25 && bmi <= 29.9) {
    return 'Overweight';
  } else {
    return 'Obese';
  }
}