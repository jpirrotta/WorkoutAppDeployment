import { ImperialMetricConversion } from '@/utils/ImperialMetricConversion';

describe('ImperialMetricConversion', () => {
  test('should correctly convert string weight and height to imperial units', () => {
    const result = ImperialMetricConversion('imperial', 70, 170);
    expect(result).toEqual({ weight: 154.32, height: 5.58 });
  });

  test('should correctly convert number weight and height to imperial units', () => {
    const result = ImperialMetricConversion('imperial', 70, 170);
    expect(result).toEqual({ weight: 154.32, height: 5.58 });
  });

  test('should correctly convert string weight and height to metric units', () => {
    const result = ImperialMetricConversion('metric', 154.32, 5.58);
    expect(result).toEqual({ weight: 70.0, height: 170.08 });
  });

  test('should correctly convert number weight and height to metric units', () => {
    const result = ImperialMetricConversion('metric', 154.32, 5.58);
    expect(result).toEqual({ weight: 70.0, height: 170.08 });
  });

  test('should return undefined values when weight or height are undefined', () => {
    let result = ImperialMetricConversion('imperial', 70, undefined);
    expect(result).toEqual({ weight: 154.32, height: undefined });

    result = ImperialMetricConversion('imperial', undefined, 170);
    expect(result).toEqual({ weight: undefined, height: 5.58 });
  });

  test('should return undefined values when weight or height are not numbers', () => {
    let result = ImperialMetricConversion('imperial', 70, NaN);
    expect(result).toEqual({ weight: 154.32, height: NaN });

    result = ImperialMetricConversion('imperial', NaN, 170);
    expect(result).toEqual({ weight: NaN, height: 5.58 });
  });
});
