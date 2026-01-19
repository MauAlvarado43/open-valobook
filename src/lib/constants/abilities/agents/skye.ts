import { AbilityDefinition } from '../base';

export const SkyeAbilities: Record<string, AbilityDefinition> = {
  'Trailblazer': {
    agent: 'Skye', ability: 'Trailblazer', shape: 'icon', stats: {
      equipTime: {
        value: 0.8,
        unit: 's'
      },
      'deploy time': {
        value: 0.18,
        unit: 's'
      },
      radius: {
        value: 22.5,
        unit: 'm'
      },
      duration: {
        value: 6,
        unit: 's'
      },
      distance: {
        value: 12,
        unit: 'm'
      },
      damage: {
        value: 30,
        unit: null
      },
      'maximum: 4 seconds': {
        value: 4,
        unit: 's'
      },
      unequipTime: {
        value: 0.7,
        unit: 's'
      }
    }
  },
  'Guiding Light': {
    agent: 'Skye', ability: 'Guiding Light', shape: 'icon', stats: {
      equipTime: {
        value: 0.8,
        unit: 's'
      },
      unequipTime: {
        value: 0.85,
        unit: 's'
      },
      velocity: {
        value: 18,
        unit: 'm'
      },
      duration: {
        value: 2,
        unit: 's'
      },
      windupTime: {
        value: 0.3,
        unit: 's'
      }
    }
  },
  'Regrowth': {
    agent: 'Skye', ability: 'Regrowth', shape: 'icon', stats: {
      equipTime: {
        value: 0.5,
        unit: 's'
      },
      radius: {
        value: 18,
        unit: 'm'
      },
      healing: {
        value: 1,
        unit: null
      },
      'tick/tick rate': {
        value: 20,
        unit: 's'
      },
      'healing pool': {
        value: 100,
        unit: null
      },
      unequipTime: {
        value: 0.7,
        unit: 's'
      }
    }
  },
  'Seekers': {
    agent: 'Skye', ability: 'Seekers', shape: 'icon', stats: {
      equipTime: {
        value: 0.8,
        unit: 's'
      },
      unequipTime: {
        value: 0.55,
        unit: 's'
      },
      'number of seekers deployed': {
        value: 3,
        unit: null
      },
      'max lifespan': {
        value: 15,
        unit: 's'
      },
      duration: {
        value: 3,
        unit: 's'
      },
      radius: {
        value: 7.5,
        unit: 'm'
      },
      'slow potency': {
        value: 60,
        unit: '%'
      }
    }
  }
};
