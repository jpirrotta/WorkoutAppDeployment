// src/utils/ImperialMetricConversion.ts

const WEIGHT_CONVERSION_TO_KG = 0.453592;
const WEIGHT_CONVERSION_TO_LBS = 2.20462;
const HEIGHT_CONVERSION_TO_CM = 30.48;
const HEIGHT_CONVERSION_TO_FT = 0.0328084;

const lbsToKg = (weight: number): number => {
  return Math.round(weight * WEIGHT_CONVERSION_TO_KG * 100) / 100;
};

const kgToLbs = (weight: number): number => {
  return Math.round(weight * WEIGHT_CONVERSION_TO_LBS * 100) / 100;
};

const ftToCm = (height: number): number => {
  return Math.round(height * HEIGHT_CONVERSION_TO_CM * 100) / 100;
};

const cmToFt = (height: number): number => {
  return Math.round(height * HEIGHT_CONVERSION_TO_FT * 100) / 100;
};

const ImperialMetricConversion = (
  selectedTab: 'imperial' | 'metric',
  weight?: number,
  height?: number
) => {
  let convertedData: { weight?: number; height?: number } = {};

  // Convert weight and height to numbers if they are not undefined
  if (weight !== undefined) {
    if (selectedTab === 'imperial') {
      convertedData.weight = kgToLbs(weight);
    } else if (selectedTab === 'metric') {
      convertedData.weight = lbsToKg(weight);
    }
  }

  if (height !== undefined) {
    if (selectedTab === 'imperial') {
      convertedData.height = cmToFt(height);
    } else if (selectedTab === 'metric') {
      convertedData.height = ftToCm(height);
    }
  }

  console.info(`Converting to ${selectedTab}`);
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
