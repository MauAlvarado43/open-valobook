import { AbilityDefinition } from '@/lib/constants/abilities/base';

export const PhoenixAbilities: Record<string, AbilityDefinition> = {
  Blaze: {
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
  'Hot Hands': {
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
  Curveball: {
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
  'Run it Back': {
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
