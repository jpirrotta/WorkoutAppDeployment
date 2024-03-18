// src/utils/EmpiricalMetricConversion.js
const logger = require('../lib/logger.js');

const WEIGHT_CONVERSION_TO_KG = 0.453592;
const WEIGHT_CONVERSION_TO_LBS = 2.20462;
const HEIGHT_CONVERSION_TO_CM = 30.48;
const HEIGHT_CONVERSION_TO_FT = 0.0328084;

const lbsToKg = (weight) => {
  return (weight * WEIGHT_CONVERSION_TO_KG).toFixed(2);
};

const kgToLbs = (weight) => {
  return (weight * WEIGHT_CONVERSION_TO_LBS).toFixed(2);
};

const ftToCm = (height) => {
  return (height * HEIGHT_CONVERSION_TO_CM).toFixed(2);
};

const cmToFt = (height) => {
  return (height * HEIGHT_CONVERSION_TO_FT).toFixed(2);
};

const EmpiricalMetricConversion = (selectedTab, weight, height) => {
  let convertedData = { weight: null, height: null };

  // Convert weight and height to numbers if they are not undefined
  if (weight !== undefined) {
    weight = parseFloat(weight);
    if (isNaN(weight)) {
      logger.info('Invalid weight');
    } else if (selectedTab === 'empirical') {
      convertedData.weight = kgToLbs(weight);
    } else if (selectedTab === 'metric') {
      convertedData.weight = lbsToKg(weight);
    }
  }

  if (height !== undefined) {
    height = parseFloat(height);
    if (isNaN(height)) {
      logger.info('Invalid height');
    } else if (selectedTab === 'empirical') {
      convertedData.height = cmToFt(height);
    } else if (selectedTab === 'metric') {
      convertedData.height = ftToCm(height);
    }
  }

  logger.info(`Converting to ${selectedTab}`);
  return convertedData;
};

module.exports = {
  EmpiricalMetricConversion,
  lbsToKg,
  kgToLbs,
  ftToCm,
  cmToFt,
  WEIGHT_CONVERSION_TO_KG,
  WEIGHT_CONVERSION_TO_LBS,
  HEIGHT_CONVERSION_TO_CM,
  HEIGHT_CONVERSION_TO_FT,
};
