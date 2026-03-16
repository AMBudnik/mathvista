import * as math from 'mathjs';
import { generatePlotData } from '../src/js/utils.js';

describe('generatePlotData', () => {
  test('generates data for linear function', () => {
    const expr = math.compile('x');
    const data = generatePlotData(expr, -2, 2);
    
    expect(data.length).toBeGreaterThan(0);
    expect(data[0].x).toBeLessThanOrEqual(-2);
  });

  test('handles quadratic function', () => {
    const expr = math.compile('x^2');
    const data = generatePlotData(expr, -2, 2);
    
    expect(data.length).toBeGreaterThan(0);
    const middlePoint = data[Math.floor(data.length / 2)];
    expect(middlePoint.y).toBeLessThan(Math.abs(data[0].y));
  });

// to-d0o - this one fails
  test('returns null for undefined values at x=0 for 1/x', () => {
    const expr = math.compile('1/x');
    const data = generatePlotData(expr, -1, 1);
    
    const zeroPoint = data.find(d => d.x === 0);
    expect(zeroPoint.y).toBeNull();
  });

  test('filters out values exceeding threshold', () => {
    const expr = math.compile('1000*x');
    const data = generatePlotData(expr, -1, 1);
    
    const largeValues = data.filter(d => d.y !== null && Math.abs(d.y) > 1000);
    expect(largeValues.length).toBe(0);
  });

  test('generates continuous data points', () => {
    const expr = math.compile('sin(x)');
    const data = generatePlotData(expr, 0, 1);
    
    expect(data.length).toBeGreaterThan(5);
  });

  test('handles undefined values at other points like x=1 for 1/(x-1)', () => {
    const expr = math.compile('1/(x-1)');
    const data = generatePlotData(expr, 0, 2);
    
    const onePoint = data.find(d => d.x === 1);
    expect(onePoint.y).toBeNull();
  });

  test('returns empty array for invalid range (xMin > xMax)', () => {
    const expr = math.compile('x');
    const data = generatePlotData(expr, 2, -2);
    
    expect(data.length).toBe(0);
  });

  test('handles large negative values exceeding threshold', () => {
    const expr = math.compile('-1001*x');
    const data = generatePlotData(expr, 1, 2);
    
    const largeNegativeValues = data.filter(d => d.y !== null && d.y < -1000);
    expect(largeNegativeValues.length).toBe(0);
    expect(data.every(d => d.y === null)).toBe(true);
  });

  test('handles constant functions', () => {
    const expr = math.compile('5');
    const data = generatePlotData(expr, -1, 1);
    
    expect(data.length).toBeGreaterThan(0);
    expect(data.every(d => d.y === 5)).toBe(true);
  });
});