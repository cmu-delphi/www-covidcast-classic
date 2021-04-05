// Indicator Info: aka The Signal Dashboard API

import { formatAPITime } from './utils';
import { callSignalAPI } from './api';
import { fetchData } from './fetchData';
import { isoParse } from 'd3-time-format';
import { timeDay } from 'd3-time';
import { addNameInfos } from '.';
import { countyInfo } from '../maps';

/**
 * @typedef {object} Coverage
 * @property {Date} date
 * @property {number} count
 * @property {number} fraction // fraction
 */

/**
 * @typedef {object} IndicatorStatus
 * @property {string} id
 * @property {string} name
 * @property {string} source
 * @property {string} covidcast_signal
 * @property {Date} latest_issue
 * @property {Date} latest_time_value
 * @property {Record<'county', Coverage[]>} coverage
 */

/**
 * @returns {Promise<IndicatorStatus[]>}
 */
export function getIndicatorStatuses() {
  return callSignalAPI().then((d) => {
    if (d.result < 0 || d.message.includes('no results')) {
      return [];
    }
    const data = d.epidata || [];
    for (const row of data) {
      row.id = row.name.toLowerCase().replace(/\s/g, '-');
      row.latest_issue = timeDay(isoParse(row.latest_issue.toString()));
      row.latest_time_value = timeDay(isoParse(row.latest_time_value.toString()));
      Object.values(row.coverage).forEach((level) => {
        for (const row of level) {
          row.date = timeDay(isoParse(row.date.toString()));
          row.fraction = row.count / countyInfo.length;
        }
      });
    }
    return data;
  });
}

/**
 *
 * @param {IndicatorStatus} indicator
 * @param {Date} date
 * @returns {Promise<(import('.').EpiDataRow & import('../maps').NameInfo)[]>}
 */
export function getAvailableCounties(indicator, date) {
  return fetchData(
    {
      id: indicator.source,
      signal: indicator.covidcast_signal,
    },
    'county',
    '*',
    date,
    { time_value: formatAPITime(date) },
    {
      multi_values: false,
    },
  ).then((rows) => addNameInfos(rows).filter((d) => d.level === 'county'));
}
