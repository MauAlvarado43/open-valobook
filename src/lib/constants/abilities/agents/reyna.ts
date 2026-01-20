import { AbilityDefinition } from '@/lib/constants/abilities/base';

export const ReynaAbilities: Record<string, AbilityDefinition> = {
  Leer: {
    agent: 'Reyna',
    ability: 'Leer',
    shape: 'area',
    stats: {
      radius: {
        max: 6,
        min: 6,
        unit: 'm',
      },
      duration: {
        value: 1.6,
        unit: 's',
      },
    },
  },
  Devour: {
    agent: 'Reyna',
    ability: 'Devour',
    shape: 'icon',
    stats: {
      duration: {
        value: 2,
        unit: 's',
      },
    },
  },
  Dismiss: {
    agent: 'Reyna',
    ability: 'Dismiss',
    shape: 'curved-wall',
    stats: {
      height: {
        max: 2,
        min: 2,
        unit: 'm',
      },
      width: {
        max: 18,
        min: 5,
        unit: 'm',
      },
      speed: {
        value: 12,
        unit: 'm/s',
      },
    },
  },
  Empress: {
    agent: 'Reyna',
    ability: 'Empress',
    shape: 'icon',
  },
};
