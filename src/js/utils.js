export function validateRange(xMin, xMax) {
  if (isNaN(xMin) || isNaN(xMax) || xMin >= xMax) {
    return false;
  }
  return true;
}

export function isZeroCloseToExisting(zeros, zero, precision) {
  return zeros.some(z => Math.abs(z - zero) < precision * 10);
}

export function findZeroInInterval(expr, low, high, precision) {
  let mid;
  while ((high - low) > precision) {
    mid = (low + high) / 2;
    const yMid = expr.evaluate({ x: mid });

    if (expr.evaluate({ x: low }) * yMid <= 0) {
      high = mid;
    } else {
      low = mid;
    }
  }
  return (low + high) / 2;
}

export function findZeros(expr, xMin, xMax) {
  const zeros = [];
  const step = 0.1;
  const precision = 0.0001;

  for (let x = xMin; x < xMax; x += step) {
    if (Math.abs(x) < precision) continue;

    const [x1, x2] = [x, x + step];
    const [y1, y2] = [expr.evaluate({ x: x1 }), expr.evaluate({ x: x2 })];

    if (!Number.isFinite(y1) || !Number.isFinite(y2)) continue;

    if (y1 * y2 <= 0) {
      const zero = findZeroInInterval(expr, x1, x2, precision);
      if (zero && !isZeroCloseToExisting(zeros, zero, precision)) {
        zeros.push(zero);
      }
    }
  }

  return zeros;
}

export function generatePlotData(parsed, xMin, xMax) {
  const values = [];
  const threshold = 1000;
  const step = 0.1;

  for (let x = xMin; x <= xMax + step / 2; x += step) {
    // Correct for floating point precision
    const currentX = Math.abs(x) < step / 2 ? 0 : Number(x.toFixed(10));
    let y;

    try {
      y = parsed.evaluate({ x: currentX });
    } catch {
      y = null;
    }

    if (typeof y !== 'number' || !isFinite(y) || Math.abs(y) > threshold) {
      values.push({ x: currentX, y: null });
    } else {
      values.push({ x: currentX, y });
    }
  }
  return values;
}