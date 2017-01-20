/**
 * Round float to specified decimal.
 * @param {number} number Float to round.
 * @param {number} places Number of decimal places to round up to.
 * @return {number} Rounded float.
 * @public
 */
function roundToDecimal(number, places) {
  if (!places) {
    return number;
  }

  const decimal = places * 10;
  return Math.round(number * decimal) / decimal;
}

/**
 * Get the average of any given number of values.
 * @param {Iterator<number>} args All values to be averaged.
 * @return {number} Average of values.
 * @public
 */
function average(...args) {
  if (!args) {
    return null;
  }

  const values = Array.from(args);
  const sum = values.reduce((total, value) => {
    total += value;
  }, 0);

  return sum / values.length;
}

export {
  roundToDecimal,
  average,
}
