import { AbilityDefinition } from '../base';

export const TejoAbilities: Record<string, AbilityDefinition> = {
  'Corriente': { agent: 'Tejo', ability: 'Corriente', shape: 'path', defaultHeight: 250 },
  'Guided Salvo': {
    agent: 'Tejo', ability: 'Guided Salvo', shape: 'icon', stats: {
      equipTime: {
        value: 0.7,
        unit: 's'
      },
      distance: {
        value: 45,
        unit: 'm'
      },
      unequipTime: {
        value: 0.92,
        unit: 's'
      },
      'flight altitude': {
        value: 2,
        unit: 'm'
      },
      radii: {
        value: 2.5,
        unit: 'm'
      },
      windupTime: {
        value: 1.25,
        unit: 's'
      },
      damage: {
        value: 65,
        unit: null
      },
      'ticks/tick rate': {
        value: 1,
        unit: 's'
      }
    }
  },
  'Special Delivery': {
    agent: 'Tejo', ability: 'Special Delivery', shape: 'area', stats: {
      equipTime: {
        value: 0.5,
        unit: 's'
      },
      unequipTime: {
        value: 0.4,
        unit: 's'
      },
      duration: {
        value: 3,
        unit: 's'
      },
      radius: {
        value: 5.25,
        unit: 'm'
      },
      windupTime: {
        value: 0.9,
        unit: 's'
      },
      damage: {
        value: {
          min: 20,
          max: 35
        },
        unit: null
      },
      'maximum 25 seconds': {
        value: 2.5,
        unit: 's'
      }
    }
  },
  'Armageddon': {
    agent: 'Tejo', ability: 'Armageddon', shape: 'path', stats: {
      equipTime: {
        value: 0.6,
        unit: 's'
      },
      distance: {
        value: 52.5,
        unit: 'm'
      },
      windupTime: {
        value: 3.08,
        unit: 's'
      },
      delay: {
        value: 0.33,
        unit: 's'
      },
      unequipTime: {
        value: 1,
        unit: 's'
      },
      'area size': {
        value: 10,
        unit: 'm'
      },
      damage: {
        value: 60,
        unit: null
      },
      'detonation ticks/tick rate per segment': {
        value: 1,
        unit: 's'
      },
      'total 4 ticks': {
        value: 4,
        unit: null
      }
    }
  }
};
