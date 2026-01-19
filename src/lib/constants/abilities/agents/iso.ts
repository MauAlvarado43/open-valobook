import { AbilityDefinition } from '../base';

export const IsoAbilities: Record<string, AbilityDefinition> = {
  'Contingency': {
    agent: 'Iso',
    ability: 'Contingency',
    shape: 'path',
    stats: {
      height: {
        max: 27.5,
        min: 13.75,
        unit: 'm'
      },
      width: {
        max: 5,
        min: 5,
        unit: 'm'
      },
      speed: {
        value: 5.4,
        unit: 'm/s'
      }
    }
  },
  'Undercut': {
    agent: 'Iso',
    ability: 'Undercut',
    shape: 'path',
    stats: {
      width: {
        max: 3,
        min: 3,
        unit: 'm'
      },
      height: {
        max: 34.875,
        min: 34.875,
        unit: 'm'
      },
      duration: {
        value: 1.55,
        unit: 's'
      },
    }
  },
  'Double Tap': {
    agent: 'Iso',
    ability: 'Double Tap',
    shape: 'icon',
    stats: {
      width: {
        value: 1,
        unit: 'm'
      },
      duration: {
        value: 12,
        unit: 's'
      },
    }
  },
  'Kill Contract': {
    agent: 'Iso',
    ability: 'Kill Contract',
    shape: 'path',
    stats: {
      width: {
        max: 15,
        min: 15,
        unit: 'm'
      },
      height: {
        max: 36,
        min: 36,
        unit: 'm'
      },
      duration: {
        value: 13,
        unit: 's'
      },
    }
  },
};
