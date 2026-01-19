import { AbilityDefinition } from '../base';

export const ReynaAbilities: Record<string, AbilityDefinition> = {
  'Devour': {
    agent: 'Reyna', ability: 'Devour', shape: 'icon', stats: {
      delay: {
        value: 0.1,
        unit: 's'
      },
      unequipTime: {
        value: 0.5,
        unit: 's'
      },
      healing: {
        value: 1,
        unit: null
      },
      'ticks/tick rate': {
        value: 25,
        unit: 's'
      },
      duration: {
        value: 2,
        unit: 's'
      }
    }
  },
  'Dismiss': {
    agent: 'Reyna', ability: 'Dismiss', shape: 'icon', stats: {
      duration: {
        value: 1.5,
        unit: 's'
      },
      unequipTime: {
        value: 0.6,
        unit: 's'
      },
      'movement speed increase': {
        value: 12,
        unit: 'm/s'
      }
    }
  },
  'Leer': {
    agent: 'Reyna', ability: 'Leer', shape: 'icon', stats: {
      equipTime: {
        value: 0.77,
        unit: 's'
      },
      distance: {
        value: 10,
        unit: 'm'
      },
      unequipTime: {
        value: 0.5,
        unit: 's'
      },
      windupTime: {
        value: 0.55,
        unit: 's'
      },
      '04 seconds on arrival at target location': {
        value: 0.4,
        unit: 's'
      },
      duration: {
        value: 1.6,
        unit: 's'
      },
      radius: {
        value: 6,
        unit: 'm'
      }
    }
  },
  'Empress': {
    agent: 'Reyna', ability: 'Empress', shape: 'icon', stats: {
      windupTime: {
        value: 1,
        unit: 's'
      },
      buffs: {
        value: 10,
        unit: '%'
      }
    }
  }
};
