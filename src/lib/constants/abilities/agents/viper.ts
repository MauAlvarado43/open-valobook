import { AbilityDefinition } from '../base';

export const ViperAbilities: Record<string, AbilityDefinition> = {
  'Poison Cloud': {
    agent: 'Viper', ability: 'Poison Cloud', shape: 'smoke', stats: {
      equipTime: {
        value: 0.8,
        unit: 's'
      },
      unequipTime: {
        value: 0.7,
        unit: 's'
      },
      distance: {
        value: 4,
        unit: 'm'
      },
      windupTime: {
        value: 1.75,
        unit: 's'
      },
      radius: {
        value: 4.5,
        unit: 'm'
      },
      'deactivation time': {
        value: 0.8,
        unit: 's'
      },
      'activation cooldowns': {
        value: 2,
        unit: 's'
      },
      '5 seconds': {
        value: 5,
        unit: 's'
      }
    }
  },
  'Snake Bite': {
    agent: 'Viper', ability: 'Snake Bite', shape: 'area', stats: {
      equipTime: {
        value: 0.8,
        unit: 's'
      },
      unequipTime: {
        value: 0.7,
        unit: 's'
      },
      radius: {
        value: 4.5,
        unit: 'm'
      },
      damage: {
        value: 1,
        unit: null
      },
      'total 76-79': {
        value: 1,
        unit: null
      },
      'x05 multiplier to objects': {
        value: 0.5,
        unit: null
      },
      'ticks/tick rate': {
        value: 12.5,
        unit: 's'
      },
      'total 76-79 ticks': {
        value: 1,
        unit: null
      },
      duration: {
        value: 6.5,
        unit: 's'
      }
    }
  },
  'Toxic Screen': {
    agent: 'Viper', ability: 'Toxic Screen', shape: 'wall', stats: {
      equipTime: {
        value: 0.8,
        unit: 's'
      },
      unequipTime: {
        value: 0.7,
        unit: 's'
      },
      'total emitters at max range': {
        value: 30,
        unit: null
      },
      'wall dimensions': {
        value: 2,
        unit: 'm'
      },
      windupTime: {
        value: 0.5,
        unit: 's'
      },
      'deactivation time': {
        value: 0.8,
        unit: 's'
      },
      'activation cooldowns': {
        value: 2,
        unit: 's'
      },
      '5 seconds': {
        value: 5,
        unit: 's'
      }
    }
  },
  's Pit': {
    agent: 'Viper', ability: 'Viper\'s Pit', shape: 'area', stats: {
      equipTime: {
        value: 0.5,
        unit: 's'
      },
      radius: {
        value: 7.25,
        unit: 'm'
      },
      unequipTime: {
        value: 1.35,
        unit: 's'
      },
      'deploy time': {
        value: 6,
        unit: 's'
      },
      duration: {
        value: 8,
        unit: 's'
      },
      'integrity regeneration rate': {
        value: 4,
        unit: 's'
      },
      'deactivation time': {
        value: 3.25,
        unit: 's'
      }
    }
  }
};
