import { AbilityDefinition } from '../base';

export const WaylayAbilities: Record<string, AbilityDefinition> = {
  'Saturate': {
    agent: 'Waylay',
    ability: 'Saturate',
    shape: 'area',
    stats: {
      radius: {
        max: 6,
        min: 6,
        unit: 'm'
      },
      duration: {
        value: 3,
        unit: 's'
      }
    }
  },
  'Lightspeed': {
    agent: 'Waylay',
    ability: 'Lightspeed',
    shape: 'curved-wall',
    maxIntermediatePoints: 1,
    tension: 0,
    stats: {
      distance: {
        max: 18,
        min: 9,
        unit: 'm'
      }
    }
  },
  'Refract': {
    agent: 'Waylay',
    ability: 'Refract',
    shape: 'curved-wall',
    stats: {
      height: {
        value: 2,
        unit: 'm'
      },
      width: {
        value: 35,
        unit: 'm'
      },
      duration: {
        value: 8,
        unit: 's'
      },
    }
  },
  'Convergent Paths': {
    agent: 'Waylay',
    ability: 'Convergent Paths',
    shape: 'path',
    stats: {
      width: {
        max: 13.5,
        min: 13.5,
        unit: 'm'
      },
      height: {
        max: 36,
        min: 36,
        unit: 'm'
      },
      duration: {
        value: 7,
        unit: 's'
      }
    }
  },
};
