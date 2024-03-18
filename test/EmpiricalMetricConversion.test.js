const { EmpiricalMetricConversion } = require('../src/utils/EmpiricalMetricConversion');

describe('EmpiricalMetricConversion', () => {
  test('should correctly convert string weight and height to empirical units', () => {
    const result = EmpiricalMetricConversion('empirical', '70', '170');
    expect(result).toEqual({ weight: '154.32', height: '5.58' });
  });

  test('should correctly convert number weight and height to empirical units', () => {
    const result = EmpiricalMetricConversion('empirical', 70, 170);
    expect(result).toEqual({ weight: '154.32', height: '5.58' });
  });

  test('should correctly convert string weight and height to metric units', () => {
    const result = EmpiricalMetricConversion('metric', '154.32', '5.58');
    expect(result).toEqual({ weight: '70.00', height: '170.08' });
  });

  test('should correctly convert number weight and height to metric units', () => {
    const result = EmpiricalMetricConversion('metric', 154.32, 5.58);
    expect(result).toEqual({ weight: '70.00', height: '170.08' });
  });

  test('should return null values when weight or height are undefined', () => {
    let result = EmpiricalMetricConversion('empirical', '70', undefined);
    expect(result).toEqual({ weight: '154.32', height: null });

    result = EmpiricalMetricConversion('empirical', undefined, '170.08');
    expect(result).toEqual({ weight: null, height: '5.58' });
  });

  test('should return null values when weight or height are not numbers', () => {
    let result = EmpiricalMetricConversion('empirical', '70', 'not a number');
    expect(result).toEqual({ weight: '154.32', height: null });

    result = EmpiricalMetricConversion('empirical', 'not a number', '170.08');
    expect(result).toEqual({ weight: null, height: '5.58' });
  });
});