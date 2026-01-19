import { AbilityDefinition } from '../base';

export const BrimstoneAbilities: Record<string, AbilityDefinition> = {
  'Stim Beacon': {
    agent: 'Brimstone',
    ability: 'Stim Beacon',
    shape: 'area',
    stats: {
      radius: {
        max: 6,
        min: 6,
        unit: 'm'
      },
      duration: {
        value: 4,
        unit: 's'
      }
    }
  },
  'Incendiary': {
    agent: 'Brimstone',
    ability: 'Incendiary',
    shape: 'area',
    stats: {
      radius: {
        max: 4.5,
        min: 4.5,
        unit: 'm'
      },
      duration: {
        value: 8,
        unit: 's'
      }
    }
  },
  'Sky Smoke': {
    agent: 'Brimstone',
    ability: 'Sky Smoke',
    shape: 'smoke',
    stats: {
      radius: {
        max: 4.15,
        min: 4.15,
        unit: 'm'
      },
      duration: {
        value: 19.25,
        unit: 's'
      }
    }
  },
  'Orbital Strike': {
    agent: 'Brimstone',
    ability: 'Orbital Strike',
    shape: 'area',
    stats: {
      radius: {
        max: 9,
        min: 9,
        unit: 'm'
      },
      duration: {
        value: 3,
        unit: 's'
      }
    }
  },
};
