import { AbilityDefinition } from '../base';

export const ViperAbilities: Record<string, AbilityDefinition> = {
  'Snake Bite': {
    agent: 'Viper',
    ability: 'Snake Bite',
    shape: 'area',
    stats: {
      radius: {
        max: 4.5,
        min: 4.5,
        unit: 'm'
      },
      duration: {
        value: 6.5,
        unit: 's'
      }
    }
  },
  'Poison Cloud': {
    agent: 'Viper',
    ability: 'Poison Cloud',
    shape: 'smoke',
    stats: {
      radius: {
        max: 4.5,
        min: 4.5,
        unit: 'm'
      },
    }
  },
  'Toxic Screen': {
    agent: 'Viper',
    ability: 'Toxic Screen',
    shape: 'wall',
    stats: {
      width: {
        max: 60,
        min: 10,
        unit: 'm'
      },
      height: {
        max: 2,
        min: 2,
        unit: 'm'
      }
    }
  },
  'Viper\'s Pit': {
    agent: 'Viper',
    ability: 'Viper\'s Pit',
    shape: 'area',
    stats: {
      radius: {
        max: 9,
        min: 9,
        unit: 'm'
      },
    }
  }
};
