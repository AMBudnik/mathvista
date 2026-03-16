import { validateRange } from '../src/js/utils.js';

describe('validateRange', () => {
  test('returns true for valid range', () => {
    expect(validateRange(-5, 5)).toBe(true);
  });

  test('returns false when xMin >= xMax', () => {
    expect(validateRange(5, 5)).toBe(false);
    expect(validateRange(5, -5)).toBe(false);
  });

  test('returns false for NaN values', () => {
    expect(validateRange(NaN, 5)).toBe(false);
    expect(validateRange(-5, NaN)).toBe(false);
    expect(validateRange(NaN, NaN)).toBe(false);
  });

  test('returns true for negative ranges', () => {
    expect(validateRange(-10, -1)).toBe(true);
  });

  test('returns true for ranges crossing zero', () => {
    expect(validateRange(-5, 5)).toBe(true);
  });
});
