import { AbilityDefinition } from '../base';

export const VyseAbilities: Record<string, AbilityDefinition> = {
  'Shear': {
    agent: 'Vyse', ability: 'Shear', shape: 'wall', stats: {
      equipTime: {
        value: 0.7,
        unit: 's'
      },
      distance: {
        value: 15,
        unit: 'm'
      },
      'wall dimensions': {
        value: {
          min: 1,
          max: 12
        },
        unit: 'm'
      },
      unequipTime: {
        value: 0.8,
        unit: 's'
      },
      'deploy time': {
        value: 2,
        unit: 's'
      },
      windupTime: {
        value: 0.8,
        unit: 's'
      },
      duration: {
        value: 6,
        unit: 's'
      },
      '08-second deactivation time': {
        value: 0.8,
        unit: 's'
      }
    }
  },
  'Arc Rose': {
    agent: 'Vyse', ability: 'Arc Rose', shape: 'area', stats: {
      equipTime: {
        value: 0.8,
        unit: 's'
      },
      distance: {
        value: 20,
        unit: 'm'
      },
      'max wall penetration': {
        value: 10,
        unit: 'm'
      },
      height: {
        value: 4.5,
        unit: 'm'
      },
      unequipTime: {
        value: 0.7,
        unit: 's'
      },
      radius: {
        value: 10,
        unit: 'm'
      },
      'deploy time': {
        value: 0.8,
        unit: 's'
      },
      windupTime: {
        value: 0.5,
        unit: 's'
      },
      duration: {
        value: 2,
        unit: 's'
      }
    }
  },
  'Razorvine': {
    agent: 'Vyse', ability: 'Razorvine', shape: 'wall', stats: {
      equipTime: {
        value: 0.8,
        unit: 's'
      },
      unequipTime: {
        value: 0.8,
        unit: 's'
      },
      'deploy time': {
        value: 0.75,
        unit: 's'
      },
      radius: {
        value: 3.5,
        unit: 'm'
      },
      windupTime: {
        value: 0.2,
        unit: 's'
      },
      'slow amount': {
        value: 15,
        unit: '%'
      },
      damage: {
        value: 10,
        unit: 'm'
      },
      duration: {
        value: 6,
        unit: 's'
      }
    }
  },
  'Steel Garden': {
    agent: 'Vyse', ability: 'Steel Garden', shape: 'area', stats: {
      equipTime: {
        value: 0.7,
        unit: 's'
      },
      radius: {
        value: 28,
        unit: 'm'
      },
      unequipTime: {
        value: 0.8,
        unit: 's'
      },
      windupTime: {
        value: 4.4,
        unit: 's'
      },
      duration: {
        value: 8,
        unit: 's'
      }
    }
  }
};
