import { AbilityDefinition } from '@/lib/constants/abilities/base';

export const SkyeAbilities: Record<string, AbilityDefinition> = {
  Regrowth: {
    agent: 'Skye',
    ability: 'Regrowth',
    shape: 'area',
    stats: {
      radius: {
        max: 18,
        min: 18,
        unit: 'm',
      },
    },
  },
  Trailblazer: {
    agent: 'Skye',
    ability: 'Trailblazer',
    shape: 'curved-wall',
    stats: {
      width: {
        max: 40,
        min: 10,
        unit: 'm',
      },
    },
  },
  'Guiding Light': {
    agent: 'Skye',
    ability: 'Guiding Light',
    shape: 'curved-wall',
    stats: {
      height: {
        max: 2,
        min: 2,
        unit: 'm',
      },
      width: {
        max: 36,
        min: 10,
        unit: 'm',
      },
      speed: {
        value: 18,
        unit: 'm/s',
      },
      duration: {
        value: 2,
        unit: 's',
      },
    },
  },
  Seekers: {
    agent: 'Skye',
    ability: 'Seekers',
    shape: 'icon',
    stats: {
      duration: {
        value: 15,
        unit: 's',
      },
    },
  },
};
