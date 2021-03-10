/**
 * @typedef {object} Mode
 * @property {string} id
 * @property {string} label
 * @property {Promise<any>} component
 */

/**
 * @type {Mode[]}
 */
const modes = [
  {
    id: 'landing',
    label: 'COVIDcast Overview',
    component: () => import(/* webpackChunkName: 'm-landing' */ './landing/Landing.svelte').then((r) => r.default),
  },
  {
    id: 'summary',
    label: 'Location Summary',
    component: () =>
      import(/* webpackChunkName: 'm-overview' */ './mobile/MobileOverview.svelte').then((r) => r.default),
  },
  {
    id: 'indicator',
    label: 'Indicator Details',
    component: () =>
      import(/* webpackChunkName: 'm-indicator' */ './mobile/MobileIndicatorOverview.svelte').then((r) => r.default),
  },
  {
    id: 'classic',
    label: 'Classic COVIDCast',
    component: () => import(/* webpackChunkName: 'm-old' */ './overview/Overview.svelte').then((r) => r.default),
  },
  // {
  //   id: 'timelapse',
  //   label: 'Timelapse',
  //   component: () =>
  //     import(/* webpackChunkName: 'm-timelapse' */ './timelapse/TimeLapse.svelte').then((r) => r.default),
  // },
  // {
  //   id: 'top10',
  //   label: 'Top 10',
  //   component: () => import(/* webpackChunkName: 'm-top10' */ './top10/Top10.svelte').then((r) => r.default),
  // },
  // {
  //   id: 'single',
  //   label: 'Region Details',
  //   component: () => import(/* webpackChunkName: 'm-single' */ './single/SingleLocation.svelte').then((r) => r.default),
  // },
  {
    id: 'survey-results',
    label: 'Survey Results',
    component: () => import(/* webpackChunkName: 'm-survey' */ './survey/Survey.svelte').then((r) => r.default),
  },
  {
    id: 'export',
    label: 'Export Data',
    component: () => import(/* webpackChunkName: 'm-export' */ './exportdata/ExportData.svelte').then((r) => r.default),
  },
  // {
  //   id: 'lab',
  //   label: 'Lab',
  //   component: () => import(/* webpackChunkName: 'mode-lab' */ './lab/Lab.svelte').then((r) => r.default),
  // },
];

export default modes;

/**
 * @type {Record<'summary'|'timelapse'|'top10'|'export'|'single'|'survey-results'|'lab'|'classic'|'indicator'|'landing', Mode>}
 */
export const modeByID = {};
modes.forEach((mode) => (modeByID[mode.id] = mode));
