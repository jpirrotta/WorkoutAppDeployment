// src/utils/EmpiricalMetricConversion.js
const WEIGHT_CONVERSION = 2.20462;
const HEIGHT_CONVERSION = 0.0328084;

const EmpiricalMetricConversion = (selectedTab, weight, height) => {
  let convertedData = { weight: null, height: null };

  // Convert weight and height to numbers if they are not undefined
  if (weight !== undefined) {
    weight = parseFloat(weight);
    if (isNaN(weight)) {
      console.log('Invalid weight');
    } else if (selectedTab === 'empirical') {
      convertedData.weight = (weight * WEIGHT_CONVERSION).toFixed(2);
    } else if (selectedTab === 'metric') {
      convertedData.weight = (weight / WEIGHT_CONVERSION).toFixed(2);
    }
  }

  if (height !== undefined) {
    height = parseFloat(height);
    if (isNaN(height)) {
      console.log('Invalid height');
    } else if (selectedTab === 'empirical') {
      convertedData.height = (height * HEIGHT_CONVERSION).toFixed(2);
    } else if (selectedTab === 'metric') {
      convertedData.height = (height / HEIGHT_CONVERSION).toFixed(2);
    }
  }

  console.log(`Converting to ${selectedTab}`);
  return convertedData;
};

export default EmpiricalMetricConversion;
