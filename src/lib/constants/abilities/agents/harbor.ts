import { AbilityDefinition } from '../base';

export const HarborAbilities: Record<string, AbilityDefinition> = {
  'Storm Surge': {
    agent: 'Harbor',
    ability: 'Storm Surge',
    shape: 'area',
    stats: {
      radius: {
        max: 6,
        min: 6,
        unit: 'm'
      },
      duration: {
        value: 2,
        unit: 's'
      }
    }
  },
  'High Tide': {
    agent: 'Harbor',
    ability: 'High Tide',
    shape: 'curved-wall',
    tension: 0.3,
    stats: {
      width: {
        max: 50,
        min: 10,
        unit: 'm'
      },
      height: {
        max: 5,
        min: 5,
        unit: 'm'
      },
      duration: {
        value: 15,
        unit: 's'
      },
    }
  },
  'Cove': {
    agent: 'Harbor',
    ability: 'Cove',
    shape: 'smoke',
    stats: {
      radius: {
        max: 4.6,
        min: 4.6,
        unit: 'm'
      },
    }
  },
  'Reckoning': {
    agent: 'Harbor',
    ability: 'Reckoning',
    shape: 'path',
    stats: {
      height: {
        max: 28,
        min: 28,
        unit: 'm'
      },
      width: {
        max: 21,
        min: 21,
        unit: 'm'
      },
      speed: {
        value: 8,
        unit: 'm/s'
      },
      duration: {
        value: 3,
        unit: 's'
      }
    }
  },
};
