import { AbilityDefinition } from '../base';

export const GekkoAbilities: Record<string, AbilityDefinition> = {
  'Mosh Pit': {
    agent: 'Gekko',
    ability: 'Mosh Pit',
    shape: 'area',
    stats: {
      radius: {
        max: 6.2,
        min: 6.2,
        unit: 'm'
      },
      duration: {
        value: 3,
        unit: 's'
      }
    }
  },
  'Wingman': {
    agent: 'Gekko',
    ability: 'Wingman',
    shape: 'curved-wall',
    tension: 0,
    stats: {
      height: {
        max: 6,
        min: 6,
        unit: 'm'
      },
      width: {
        max: 31.5,
        min: 5,
        unit: 'm'
      },
    }
  },
  'Dizzy': {
    agent: 'Gekko',
    ability: 'Dizzy',
    shape: 'curved-wall',
    tension: 0,
    stats: {
      width: {
        max: 12.5,
        min: 5,
        unit: 'm'
      },
      height: {
        max: 2.5,
        min: 2.5,
        unit: 'm'
      },
      distance: {
        value: 45,
        unit: 'm'
      }
    }
  },
  'Thrash': {
    agent: 'Gekko',
    ability: 'Thrash',
    shape: 'curved-wall',
    tension: 0.3,
    stats: {
      width: {
        max: 67.32,
        min: 10,
        unit: 'm'
      },
      height: {
        max: 5,
        min: 5,
        unit: 'm'
      },
      speed: {
        value: 11.22,
        unit: 'm/s'
      },
    }
  }
};
