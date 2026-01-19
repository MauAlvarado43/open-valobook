import { AbilityDefinition } from '../base';

export const VetoAbilities: Record<string, AbilityDefinition> = {
  'Interceptor': {
    agent: 'Veto', ability: 'Interceptor', shape: 'icon', stats: {
      equipTime: {
        value: 0.8,
        unit: 's'
      },
      distance: {
        value: 7,
        unit: 'm'
      },
      unequipTime: {
        value: 0.7,
        unit: 's'
      },
      'deployment time': {
        value: 0.35,
        unit: 's'
      },
      windupTime: {
        value: 0.5,
        unit: 's'
      },
      'cast time': {
        value: 0.5,
        unit: 's'
      },
      duration: {
        value: 9,
        unit: 's'
      },
      radius: {
        value: 18,
        unit: 'm'
      },
      damage: {
        value: 100,
        unit: null
      },
      'ticks/tick rate': {
        value: 8,
        unit: 's'
      },
      delay: {
        value: 0.2,
        unit: 's'
      }
    }
  },
  'Crosscut': {
    agent: 'Veto', ability: 'Crosscut', shape: 'wall', stats: {
      equipTime: {
        value: 0.8,
        unit: 's'
      },
      distance: {
        value: 20,
        unit: 'm'
      },
      unequipTime: {
        value: 0.5,
        unit: 's'
      },
      'deployment time': {
        value: 1.5,
        unit: 's'
      },
      radius: {
        value: 24,
        unit: 'm'
      },
      duration: {
        value: 1.6,
        unit: 's'
      },
      windupTime: {
        value: 1,
        unit: 's'
      }
    }
  },
  'Evolution': {
    agent: 'Veto', ability: 'Evolution', shape: 'icon', stats: {
      windupTime: {
        value: 1,
        unit: 's'
      },
      buffs: {
        value: 10,
        unit: '%'
      },
      healing: {
        value: 40,
        unit: null
      }
    }
  },
  'Chokehold': {
    agent: 'Veto', ability: 'Chokehold', shape: 'area', stats: {
      equipTime: {
        value: 0.8,
        unit: 's'
      },
      unequipTime: {
        value: 0.6,
        unit: 's'
      },
      'deployment time': {
        value: 1.5,
        unit: 's'
      },
      'detection radii': {
        value: 6.58,
        unit: 'm'
      },
      'agents detecting the trap: 9 meters': {
        value: 9,
        unit: 'm'
      },
      windupTime: {
        value: 0.5,
        unit: 's'
      },
      'decay stats': {
        value: 75,
        unit: 's'
      },
      radius: {
        value: 6.58,
        unit: 'm'
      },
      duration: {
        value: 4.5,
        unit: 's'
      }
    }
  }
};
