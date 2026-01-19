import { AbilityDefinition } from '../base';

export const SovaAbilities: Record<string, AbilityDefinition> = {
  's Fury': {
    agent: 'Sova', ability: 'Hunter\'s Fury', shape: 'path', stats: {
      equipTime: {
        value: 0.8,
        unit: 's'
      },
      ammunition: {
        value: 3,
        unit: null
      },
      duration: {
        value: 6,
        unit: 's'
      },
      windupTime: {
        value: 1,
        unit: 's'
      },
      'fire rate': {
        value: 1,
        unit: 's'
      },
      distance: {
        value: 1.5,
        unit: 'm'
      },
      'cylinder size': {
        value: 66,
        unit: 'm'
      },
      damage: {
        value: 80,
        unit: null
      },
      unequipTime: {
        value: 1,
        unit: 's'
      }
    }
  },
  'Recon Bolt': {
    agent: 'Sova', ability: 'Recon Bolt', shape: 'area', stats: {
      equipTime: {
        value: 0.8,
        unit: 's'
      },
      'maximum bounces': {
        value: 2,
        unit: null
      },
      'minimum charge times and projectile strengths': {
        value: 2,
        unit: 's'
      },
      unequipTime: {
        value: 0.7,
        unit: 's'
      },
      windupTime: {
        value: 0.667,
        unit: 's'
      },
      radius: {
        value: 30,
        unit: 'm'
      },
      'sonar pulses': {
        value: 1,
        unit: 's'
      },
      'total 2 pulses': {
        value: 2,
        unit: null
      },
      duration: {
        value: 0.75,
        unit: 's'
      }
    }
  },
  'Shock Bolt': {
    agent: 'Sova', ability: 'Shock Bolt', shape: 'area', stats: {
      equipTime: {
        value: 0.8,
        unit: 's'
      },
      'maximum bounces': {
        value: 2,
        unit: null
      },
      'minimum charge times and projectile strengths': {
        value: 2,
        unit: 's'
      },
      unequipTime: {
        value: 0.7,
        unit: 's'
      },
      windupTime: {
        value: 0.4,
        unit: 's'
      },
      radii: {
        value: 1.5,
        unit: 'm'
      },
      damage: {
        value: 1,
        unit: null
      },
      'maximum: 75': {
        value: 75,
        unit: null
      }
    }
  },
  'Owl Drone': {
    agent: 'Sova', ability: 'Owl Drone', shape: 'icon', stats: {
      equipTime: {
        value: 0.9,
        unit: 's'
      },
      'deploy time': {
        value: 0.25,
        unit: 's'
      },
      duration: {
        value: 7,
        unit: 's'
      },
      'reveal stats': {
        value: 0.6,
        unit: 's'
      },
      'total 2 pings1st ping 16 seconds after dart impact2nd ping 12 seconds after 1st ping ends': {
        value: 2,
        unit: 's'
      },
      'dart cooldown': {
        value: 5,
        unit: 's'
      },
      unequipTime: {
        value: 0.7,
        unit: 's'
      }
    }
  }
};
