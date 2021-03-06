import { nationInfo, stateInfo, countyInfo, msaInfo, hrrInfo, levelMegaCountyId, hhsInfo } from '../data/regions';

export function loadSources(additionalProperties = {}) {
  // mark to be loaded as fast as possible
  return import(/* webpackChunkName: 'geo' */ './geo').then((r) =>
    r.default(nationInfo, stateInfo, countyInfo, msaInfo, hrrInfo, hhsInfo, levelMegaCountyId, additionalProperties),
  );
}
