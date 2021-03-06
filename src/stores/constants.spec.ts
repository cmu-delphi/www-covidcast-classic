/// <reference types="jest" />
import { EPIDATA_CASES_OR_DEATH_VALUES, getLevelInfo, sensorList } from './constants';

describe('sensorList', () => {
  test.each(sensorList.map((d) => [d]))('has structure %s', (sensor) => {
    expect(typeof sensor.key).toBe('string');
    expect(typeof sensor.name).toBe('string');
    if (sensor.isCasesOrDeath) {
      expect(Object.keys(sensor.casesOrDeathSignals)).toEqual(EPIDATA_CASES_OR_DEATH_VALUES);
    }
  });
});

describe('getLevelInfo', () => {
  test('existing', () => {
    expect(getLevelInfo('county').id).toBe('county');
    expect(getLevelInfo('county').label).toBe('County');
  });
  test('invalid', () => {
    expect(getLevelInfo('test').id).toBe('test');
    expect(getLevelInfo('test').label).toBe('Test');
  });
});
