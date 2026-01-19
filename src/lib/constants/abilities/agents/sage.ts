import { AbilityDefinition } from '../base';

export const SageAbilities: Record<string, AbilityDefinition> = {
  'Barrier Orb': {
    agent: 'Sage', ability: 'Barrier Orb', shape: 'wall', stats: {
      equipTime: {
        value: 0.8,
        unit: 's'
      },
      length: {
        value: 15,
        unit: 'm'
      },
      unequipTime: {
        value: 0.7,
        unit: 's'
      },
      'deploy time': {
        value: 1.35,
        unit: 's'
      },
      'time taken to fortify': {
        value: 2,
        unit: 's'
      },
      size: {
        value: 4,
        unit: 'm'
      },
      duration: {
        value: 40,
        unit: 's'
      }
    }
  },
  'Slow Orb': {
    agent: 'Sage', ability: 'Slow Orb', shape: 'area', stats: {
      equipTime: {
        value: 0.5,
        unit: 's'
      },
      unequipTime: {
        value: 0.4,
        unit: 's'
      },
      windupTime: {
        value: 0.5,
        unit: 's'
      },
      'slow amount': {
        value: 50,
        unit: '%'
      },
      duration: {
        value: 7,
        unit: 's'
      }
    }
  },
  'Healing Orb': {
    agent: 'Sage', ability: 'Healing Orb', shape: 'icon', stats: {
      equipTime: {
        value: 0.5,
        unit: 's'
      },
      unequipTime: {
        value: 0.7,
        unit: 's'
      },
      healing: {
        value: 20,
        unit: 'HP'
      },
      duration: {
        value: 5,
        unit: 's'
      }
    }
  },
  'Resurrection': {
    agent: 'Sage', ability: 'Resurrection', shape: 'icon', stats: {
      equipTime: {
        value: 0.8,
        unit: 's'
      },
      distance: {
        value: 12,
        unit: 'm'
      },
      windupTime: {
        value: 2,
        unit: 's'
      },
      unequipTime: {
        value: 1,
        unit: 's'
      },
      duration: {
        value: 1.3,
        unit: 's'
      }
    }
  }
};
