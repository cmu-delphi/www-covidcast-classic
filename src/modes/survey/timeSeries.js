import { createSignalDateHighlight, CURRENT_DATE_HIGHLIGHT } from '../../components/DetailView/vegaSpec';
import { addMissing, fetchTimeSlice } from '../../data';
import { factor } from './questions';

/**
 * @typedef {object} Params
 * @property {import('../../maps').NameInfo} region
 * @property {Date} startDay
 * @property {Date} endDay
 */
/**
 * @param {import ('./questions').Question} question
 * @param {Params} params
 */
export function loadTimeSeriesData(question, params) {
  const { region, startDay, endDay } = params;
  if (!region || !startDay || !endDay) {
    return null;
  }
  const sensor = question.sensor || {
    id: question.dataSource,
    signal: question.signal,
    hasStdErr: true,
  };
  return fetchTimeSlice(
    sensor,
    region.level,
    region.propertyId,
    startDay,
    endDay,
    false,
    {
      geo_value: region.propertyId,
    },
    { advanced: true },
  ).then((r) => addMissing(r));
}

/**
 * @param {Params} params
 */
export function createTimeSeriesSpec(params) {
  /**
   * @type {import('vega-lite').TopLevelSpec}
   */
  const spec = {
    $schema: 'https://vega.github.io/schema/vega-lite/v4.json',
    data: { name: 'values' },
    padding: { left: 50, top: 6, bottom: 20, right: 2 },
    autosize: {
      type: 'none',
      contains: 'padding',
      resize: true,
    },
    transform: [
      {
        calculate: `datum.value == null ? null : datum.value * ${factor}`,
        as: 'kValue',
      },
    ],
    layer: [
      {
        mark: {
          type: 'line',
          point: false,
          color: 'grey',
        },
        encoding: {
          x: {
            field: 'date_value',
            type: 'temporal',
            title: null,
            axis: {
              format: '%m/%d',
              formatType: 'cachedTime',
              tickCount: 'month',
              grid: false,
              labelSeparation: 10, // Should be based on font size.
            },
            scale:
              params.startDay && params.endDay
                ? {
                    domain: [params.startDay.getTime(), params.endDay.getTime()],
                  }
                : {},
          },
          y: {
            field: 'kValue',
            type: 'quantitative',
            scale: {
              zero: false,
            },
            axis: {
              format: '.1d',
              title: 'of 1,000 people',
              titleFontWeight: 'normal',
              grid: false,
            },
          },
        },
      },
      {
        selection: {
          highlight: {
            type: 'single',
            empty: 'none',
            on: 'mouseover',
            nearest: true,
            encodings: ['x'],
            clear: 'mouseout',
          },
        },
        mark: {
          type: 'point',
          radius: 1,
          stroke: null,
          fill: 'grey',
          tooltip: true,
        },
        encoding: {
          opacity: {
            condition: {
              selection: 'highlight',
              value: 1,
            },
            value: 0,
          },
          x: {
            field: 'date_value',
            type: 'temporal',
          },
          y: {
            field: 'kValue',
            type: 'quantitative',
          },
        },
      },
      {
        mark: {
          type: 'rule',
        },
        encoding: {
          opacity: {
            condition: {
              selection: 'highlight',
              value: 1,
            },
            value: 0,
          },
          x: {
            field: 'date_value',
            type: 'temporal',
          },
          y: {
            field: 'kValue',
            type: 'quantitative',
          },
        },
      },
      createSignalDateHighlight('maxDate', 'gray'),
      createSignalDateHighlight('refDate', 'gray'),
      CURRENT_DATE_HIGHLIGHT,
    ],
    config: {
      customFormatTypes: true,
      view: {
        stroke: false,
      },
    },
  };

  return spec;
}
