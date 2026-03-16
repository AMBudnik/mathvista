import * as math from 'mathjs';
import { findZeros, isZeroCloseToExisting } from '../src/js/utils.js';

describe('findZeros', () => {
  test('finds zero for linear function x-1', () => {
    const expr = math.compile('x - 1');
    const zeros = findZeros(expr, -5, 5);
    
    expect(zeros.length).toBeGreaterThan(0);
    expect(zeros[0]).toBeCloseTo(1, 1);
  });

  test('finds multiple zeros for x^2 - 4', () => {
    const expr = math.compile('x^2 - 4');
    const zeros = findZeros(expr, -5, 5);
    
    expect(zeros.length).toBe(2);
    expect(zeros[0]).toBeCloseTo(-2, 1);
    expect(zeros[1]).toBeCloseTo(2, 1);
  });

  test('finds zeros for quadratic x^2 - 2*x - 3', () => {
    const expr = math.compile('x^2 - 2*x - 3');
    const zeros = findZeros(expr, -5, 5);
    
    expect(zeros.length).toBe(2);
    expect(zeros.some(z => Math.abs(z - (-1)) < 0.1)).toBe(true);
    expect(zeros.some(z => Math.abs(z - 3) < 0.1)).toBe(true);
  });

  test('returns empty array when no zeros in range', () => {
    const expr = math.compile('x^2 + 1');
    const zeros = findZeros(expr, -5, 5);
    
    expect(zeros.length).toBe(0);
  });

  test('handles sine function zeros', () => {
    const expr = math.compile('sin(x)');
    const zeros = findZeros(expr, -4, 4);
    
    expect(zeros.length).toBeGreaterThan(0);
    expect(zeros.some(z => Math.abs(z) < 0.1)).toBe(true);
  });
});

describe('isZeroCloseToExisting', () => {
  test('returns true if zero is close to existing', () => {
    const zeros = [1, 3, 5];
    expect(isZeroCloseToExisting(zeros, 1.001, 0.0001)).toBe(true);
  });

  test('returns false if zero is not close', () => {
    const zeros = [1, 3, 5];
    expect(isZeroCloseToExisting(zeros, 2, 0.0001)).toBe(false);
  });

  test('handles empty array', () => {
    expect(isZeroCloseToExisting([], 1, 0.0001)).toBe(false);
  });
});