import { AbilityDefinition } from '@/lib/constants/abilities/base';

export const CloveAbilities: Record<string, AbilityDefinition> = {
  pickmeup: {
    agent: 'Clove',
    ability: 'Pick-me-up',
    shape: 'icon',
  },
  meddle: {
    agent: 'Clove',
    ability: 'Meddle',
    shape: 'area',
    stats: {
      radius: {
        max: 6,
        min: 6,
        unit: 'm',
      },
      duration: {
        value: 5,
        unit: 's',
      },
    },
  },
  ruse: {
    agent: 'Clove',
    ability: 'Ruse',
    shape: 'smoke',
    stats: {
      radius: {
        max: 4,
        min: 4,
        unit: 'm',
      },
      duration: {
        value: 13.5,
        unit: 's',
      },
    },
  },
  not_dead_yet: {
    agent: 'Clove',
    ability: 'Not Dead Yet',
    shape: 'icon',
  },
};
