import { AbilityDefinition } from '../base';

export const YoruAbilities: Record<string, AbilityDefinition> = {
  'Fakeout': {
    agent: 'Yoru', ability: 'Fakeout', shape: 'icon', stats: {
      equipTime: {
        value: 0.8,
        unit: 's'
      },
      unequipTime: {
        value: 0.7,
        unit: 's'
      },
      duration: {
        value: 10,
        unit: 's'
      },
      'flash angle': {
        value: 30,
        unit: null
      },
      windupTime: {
        value: 0.6,
        unit: 's'
      }
    }
  },
  'Blindside': {
    agent: 'Yoru', ability: 'Blindside', shape: 'icon', stats: {
      equipTime: {
        value: 0.8,
        unit: 's'
      },
      unequipTime: {
        value: 0.5,
        unit: 's'
      },
      'max travel time in air': {
        value: 2,
        unit: 's'
      },
      windupTime: {
        value: 0.6,
        unit: 's'
      },
      duration: {
        value: 1.5,
        unit: 's'
      }
    }
  },
  'Gatecrash': {
    agent: 'Yoru', ability: 'Gatecrash', shape: 'icon', stats: {
      equipTime: {
        value: 0.8,
        unit: 's'
      },
      length: {
        value: 3,
        unit: 'm'
      },
      unequipTime: {
        value: 0.5,
        unit: 's'
      },
      duration: {
        value: 30,
        unit: 's'
      },
      radius: {
        value: 4,
        unit: 'm'
      }
    }
  },
  'Dimensional Drift': {
    agent: 'Yoru', ability: 'Dimensional Drift', shape: 'icon', stats: {
      equipTime: {
        value: 0.8,
        unit: 's'
      },
      delay: {
        value: 0.4,
        unit: 's'
      },
      duration: {
        value: 10,
        unit: 's'
      },
      radius: {
        value: 15,
        unit: 'm'
      },
      unequipTime: {
        value: 0.8,
        unit: 's'
      }
    }
  }
};
