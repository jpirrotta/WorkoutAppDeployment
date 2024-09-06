// src/utils/ImperialMetricConversion.ts
import logger from '../lib/logger';

const WEIGHT_CONVERSION_TO_KG = 0.453592;
const WEIGHT_CONVERSION_TO_LBS = 2.20462;
const HEIGHT_CONVERSION_TO_CM = 30.48;
const HEIGHT_CONVERSION_TO_FT = 0.0328084;

const lbsToKg = (weight: number): string | undefined => {
  // weight is NaN or undefined return nothing
  if (isNaN(weight) || weight === undefined) {
    return;
  }
  return (weight * WEIGHT_CONVERSION_TO_KG).toFixed(2);
};

const kgToLbs = (weight: number): string | undefined => {
  if (isNaN(weight) || weight === undefined) {
    return;
  }
  return (weight * WEIGHT_CONVERSION_TO_LBS).toFixed(2);
};

const ftToCm = (height: number): string | undefined => {
  if (isNaN(height) || height === undefined) {
    return;
  }
  return (height * HEIGHT_CONVERSION_TO_CM).toFixed(2);
};

const cmToFt = (height: number): string | undefined => {
  if (isNaN(height) || height === undefined) {
    return;
  }
  return (height * HEIGHT_CONVERSION_TO_FT).toFixed(2);
};

interface ConvertedData {
  weight: string | undefined;
  height: string | undefined;
}

const ImperialMetricConversion = (
  selectedTab: 'imperial' | 'metric',
  weight?: string,
  height?: string
): ConvertedData => {
  let convertedData: ConvertedData = { weight: undefined, height: undefined };

  // Convert weight and height to numbers if they are not undefined
  if (weight !== undefined) {
    const weightNum = parseFloat(weight);
    if (isNaN(weightNum)) {
      logger.info('Invalid weight');
    } else if (selectedTab === 'imperial') {
      convertedData.weight = kgToLbs(weightNum);
    } else if (selectedTab === 'metric') {
      convertedData.weight = lbsToKg(weightNum);
    }
  }

  if (height !== undefined) {
    const heightNum = parseFloat(height);
    if (isNaN(heightNum)) {
      logger.info('Invalid height');
    } else if (selectedTab === 'imperial') {
      convertedData.height = cmToFt(heightNum);
    } else if (selectedTab === 'metric') {
      convertedData.height = ftToCm(heightNum);
    }
  }

  logger.info(`Converting to ${selectedTab}`);
  return convertedData;
};

export {
  ImperialMetricConversion,
  lbsToKg,
  kgToLbs,
  ftToCm,
  cmToFt,
  WEIGHT_CONVERSION_TO_KG,
  WEIGHT_CONVERSION_TO_LBS,
  HEIGHT_CONVERSION_TO_CM,
  HEIGHT_CONVERSION_TO_FT,
};
