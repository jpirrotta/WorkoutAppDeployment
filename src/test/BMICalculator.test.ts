import { calculateBMI, getBMICategory } from '@/utils/BMICalculator';

describe('BMI Calculator', () => {
  describe('calculateBMI', () => {
    test('should return the correct BMI when given valid weight and height', () => {
      expect(calculateBMI(70, 170)).toBe(24.2);
    });

    test('should return NaN when given invalid input', () => {
      expect(calculateBMI(70, NaN)).toBeNaN();
      expect(calculateBMI(NaN, 170)).toBeNaN();
      expect(calculateBMI(NaN, NaN)).toBeNaN();
    });
  });

  describe('getBMICategory', () => {
    test('should return the correct BMI category', () => {
      expect(getBMICategory(20.8)).toBe('Normal weight');
      expect(getBMICategory(17)).toBe('Underweight');
      expect(getBMICategory(25)).toBe('Overweight');
      expect(getBMICategory(30)).toBe('Obese');
    });
  });
});
