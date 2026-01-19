import { AbilityDefinition } from '../base';

export const WaylayAbilities: Record<string, AbilityDefinition> = {
  'Saturate': {
    agent: 'Waylay', ability: 'Saturate', shape: 'area', stats: {
      unequipTime: {
        value: 0.3,
        unit: 's'
      },
      'maximum air time': {
        value: 1,
        unit: 's'
      },
      windupTime: {
        value: 0.6,
        unit: 's'
      },
      radius: {
        value: 6,
        unit: 'm'
      },
      duration: {
        value: 3,
        unit: 's'
      }
    }
  },
  'Convergent Paths': {
    agent: 'Waylay', ability: 'Convergent Paths', shape: 'path', stats: {
      equipTime: {
        value: 0.7,
        unit: 's'
      },
      'area size': {
        value: 36,
        unit: 'm'
      },
      distance: {
        value: 3,
        unit: 'm'
      },
      'channel time': {
        value: 0.6,
        unit: 's'
      },
      unequipTime: {
        value: 0.5,
        unit: 's'
      },
      windupTime: {
        value: 1,
        unit: 's'
      },
      'ticks/tick rate': {
        value: 1,
        unit: 's'
      },
      'total 4 ticks': {
        value: 4,
        unit: null
      },
      buffs: {
        value: 10,
        unit: '%'
      },
      duration: {
        value: 7,
        unit: 's'
      }
    }
  },
  'Refract': {
    agent: 'Waylay', ability: 'Refract', shape: 'icon', stats: {
      windupTime: {
        value: 1,
        unit: 's'
      },
      duration: {
        value: 8,
        unit: 's'
      },
      radius: {
        value: 35,
        unit: 'm'
      },
      unequipTime: {
        value: 0.8,
        unit: 's'
      }
    }
  },
  'Lightspeed': {
    agent: 'Waylay', ability: 'Lightspeed', shape: 'icon', stats: {
      equipTime: {
        value: 0.8,
        unit: 's'
      },
      duration: {
        value: 0.45,
        unit: 's'
      },
      distance: {
        value: 9,
        unit: 'm'
      },
      unequipTime: {
        value: 0,
        unit: 's'
      }
    }
  }
};
