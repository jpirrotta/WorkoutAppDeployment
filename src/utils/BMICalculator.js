// src/utils/BMICalculator.js
const logger = require('../lib/logger');

function calculateBMI(weight, height) {
  // Convert inputs to numbers
  weight = parseFloat(weight);
  height = parseFloat(height);

  // Validate input
  if (isNaN(weight) || isNaN(height)) {
    logger.error('Invalid input. Weight and height must be numeric values.');
    return 'Invalid input. Weight and height must be numeric values.';
  }

  // Convert height from cm to m
  height = height / 100;

  // Calculate BMI using the metric formula: BMI = weight (kg) / height (m)²
  let bmi = weight / height ** 2;

  return bmi.toFixed(1); // Rounded to 2 decimal places
}

function getBMICategory(bmi) {
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

module.exports = { calculateBMI, getBMICategory };
