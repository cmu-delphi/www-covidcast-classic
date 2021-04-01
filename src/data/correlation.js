import { linear } from 'regression';

/**
 * @typedef {object} Lag
 * @property {number} lag
 * @property {number} r2
 */

/**
 * @typedef {object} CorrelationMetric
 * @property {number} r2At0
 * @property {number} lagAtMaxR2
 * @property {number} r2AtMaxR2
 * @property {Lag[]} lags
 */

/**
 * Use this many days of lag to compute correlation metrics
 * @type number
 */
const lag = 28;

/**
 * Generates R^2 metrics for lags between -28 and 28 days.
 *
 * For lags between 0 and 28 lag b backwards with respect to a.  For -28 to -1 lag a with
 * respect to b.
 *
 * For each lag, the input is a window of length(a)-28, such that the number of values at
 * each lag is the same.
 *
 * @param {number[]} a
 * @param {number[]} b
 * @returns {Lag[]}
 */
function generateLags(a, b) {
  const lags = [];
  const aWindow = a.slice(lag);
  const bWindow = b.slice(lag);

  for (let i = 0; i <= lag; i++) {
    const bLag = b.slice(lag - i, b.length - i);
    const model = linear(zip(aWindow, bLag));
    lags.push({ lag: i, r2: model.r2 });
  }

  for (let i = 1; i <= lag; i++) {
    const aLag = a.slice(lag - i, b.length - i);
    const model = linear(zip(aLag, bWindow));
    lags.push({ lag: -1 * i, r2: model.r2 });
  }
  return lags;
}

/**
 * Do a pair-wise combination of the elements from a and b arrays.
 * @param {number[]} a
 * @param {number[]} b
 * @returns {[number, number][]}
 */
function zip(a, b) {
  return a.map((x, i) => {
    return [x, b[i]];
  });
}
/**
 * Do a pair-wise intersection of EpiDataRow by date.
 * @param {EpiDataRow[]} a
 * @param {EpiDataRow[]} b
 * @returns {[number, number][]}
 */
function intersectEpiDataRow(a, b) {
  const aLength = a.length;
  const bLength = b.length;
  let aIndex = 0;
  let bIndex = 0;
  const intersection = [];

  while (aIndex < aLength && bIndex < bLength) {
    if (a[aIndex].time_value < b[bIndex].time_value) {
      aIndex++;
    } else if (a[aIndex].time_value > b[bIndex].time_value) {
      bIndex++;
    } else {
      intersection.push([a[aIndex].value, b[bIndex].value]);
      aIndex++;
      bIndex++;
    }
  }

  return intersection;
}

/**
 * Compute 28-day correlation metrics for a response variable given an explanatory variable.
 *
 * @param {import('./fetchData').EpiDataRow[]} response
 * @param {import('./fetchData').EpiDataRow[]} explanatory
 * @returns {CorrelationMetric}
 */
export function generateCorrelationMetrics(response, explanatory) {
  const zippedEpiData = intersectEpiDataRow(response, explanatory);
  if (zippedEpiData.length < lag * 2) {
    throw new Error(
      `Not enough data: There are only ${zippedEpiData.length} dates in both indicators in this time range.`,
    );
  }
  const responseValues = zippedEpiData.map((row) => row[0]);
  const explanatoryValues = zippedEpiData.map((row) => row[1]);

  const lags = generateLags(responseValues, explanatoryValues);
  const max = lags.reduce((acc, i) => {
    return i.r2 > acc.r2 ? i : acc;
  });

  const lagAtZero = lags.find((l) => l.lag == 0);

  return {
    r2At0: lagAtZero.r2,
    lagAtMaxR2: max.lag,
    r2AtMaxR2: max.r2,
    lags: lags,
  };
}
