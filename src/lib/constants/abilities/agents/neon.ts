import { AbilityDefinition } from '../base';

export const NeonAbilities: Record<string, AbilityDefinition> = {
  'Fast Lane': {
    agent: 'Neon',
    ability: 'Fast Lane',
    shape: 'wall',
    stats: {
      width: {
        max: 46.5,
        min: 10,
        unit: 'm'
      },
      height: {
        max: 3.5,
        min: 3.5,
        unit: 'm'
      },
      duration: {
        value: 4,
        unit: 's'
      },
    }
  },
  'Relay Bolt': {
    agent: 'Neon',
    ability: 'Relay Bolt',
    shape: 'area',
    stats: {
      radius: {
        max: 5,
        min: 5,
        unit: 'm'
      },
      duration: {
        value: 5,
        unit: 's'
      },
    }
  },
  'High Gear': {
    agent: 'Neon', ability: 'High Gear', shape: 'icon', stats: {
      duration: {
        value: 0.7,
        unit: 's'
      },
      'movement speed increase': {
        value: 35,
        unit: 'm/s'
      },
      distance: {
        value: 7,
        unit: 'm'
      }
    }
  },
  'Overdrive': {
    agent: 'Neon',
    ability: 'Overdrive',
    shape: 'icon',
  },
};
