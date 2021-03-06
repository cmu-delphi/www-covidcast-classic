import {
  currentSensor,
  currentLevel,
  currentRegion,
  currentDate,
  encoding,
  signalCasesOrDeathOptions,
  currentCompareSelection,
  appReady,
  currentInfoSensor,
} from '.';

import debounce from 'lodash-es/debounce';

interface GoogleAnalyticsLike {
  (type: 'set', page: string, value: string): void;
  (type: 'send', sub: 'pageview'): void;
  (type: 'send', sub: 'event', category: string, action: string, label?: string, value?: string): void;
}

function hasGA(obj: unknown): obj is { ga: GoogleAnalyticsLike } {
  return (obj as { ga: GoogleAnalyticsLike }).ga != null;
}

export const trackUrl = debounce((url) => {
  if (!hasGA(window)) {
    return;
  }
  // send an event to google analytics
  window.ga('set', 'page', url);
  window.ga('send', 'pageview');
}, 250);

export function trackEvent(category: string, action: string, label?: string, value?: string): void {
  if (!hasGA(window)) {
    return;
  }
  window.ga('send', 'event', category, action, label, value);
}

appReady.subscribe((v) => {
  if (!v) {
    return;
  }
  let initialRun = true;
  currentSensor.subscribe((sensor) => {
    // since subscribe is run directly with the current value
    if (initialRun) {
      return;
    }
    trackEvent('sensor', 'set', sensor);
  });
  currentLevel.subscribe((level) => {
    if (initialRun) {
      return;
    }
    trackEvent('level', 'set', level);
  });
  currentRegion.subscribe((region) => {
    if (initialRun) {
      return;
    }
    trackEvent('region', 'set', region);
  });
  currentDate.subscribe((date) => {
    if (initialRun) {
      return;
    }
    trackEvent('date', 'set', date);
  });
  encoding.subscribe((encoding) => {
    if (initialRun) {
      return;
    }
    trackEvent('encoding', 'set', encoding);
  });
  signalCasesOrDeathOptions.subscribe((r) => {
    if (initialRun) {
      return;
    }
    trackEvent('signalCasesOrDeathOptions', 'cumulative', String(r.cumulative));
    trackEvent('signalCasesOrDeathOptions', 'ratio', String(!r.incidence));
  });
  currentInfoSensor.subscribe((r) => {
    if (initialRun) {
      return;
    }
    if (!r) {
      trackEvent('help', 'hide-signal');
    } else {
      trackEvent('help', 'show-signal', r.key);
    }
  });
  currentCompareSelection.subscribe((compare) => {
    if (initialRun) {
      return;
    }
    if (!compare) {
      trackEvent('compare', 'set', 'close');
    } else if (compare.length === 0) {
      trackEvent('compare', 'set', 'open');
    } else {
      trackEvent('compare', 'change', compare.map((d) => d.info.propertyId).join(','));
    }
  });

  initialRun = false;
});
