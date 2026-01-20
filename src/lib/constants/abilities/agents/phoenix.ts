import { AbilityDefinition } from '@/lib/constants/abilities/base';

export const PhoenixAbilities: Record<string, AbilityDefinition> = {
  blaze: {
    agent: 'Phoenix',
    ability: 'Blaze',
    shape: 'curved-wall',
    stats: {
      width: {
        max: 21,
        min: 3,
        unit: 'm',
      },
      height: {
        value: 2,
        unit: 'm',
      },
      duration: {
        value: 8,
        unit: 's',
      },
    },
  },
  hot_hands: {
    agent: 'Phoenix',
    ability: 'Hot Hands',
    shape: 'area',
    stats: {
      radius: {
        max: 4.5,
        min: 4.5,
        unit: 'm',
      },
      duration: {
        value: 4,
        unit: 's',
      },
    },
  },
  curveball: {
    agent: 'Phoenix',
    ability: 'Curveball',
    shape: 'icon',
    stats: {
      duration: {
        value: 1.5,
        unit: 's',
      },
    },
  },
  run_it_back: {
    agent: 'Phoenix',
    ability: 'Run it Back',
    shape: 'curved-wall',
    stats: {
      width: {
        max: 40,
        min: 5,
        unit: 'm',
      },
      height: {
        value: 2,
        unit: 'm',
      },
      duration: {
        value: 10,
        unit: 's',
      },
    },
  },
};
