import { AbilityDefinition } from '@/lib/constants/abilities/base';

export const JettAbilities: Record<string, AbilityDefinition> = {
  cloudburst: {
    agent: 'Jett',
    ability: 'Cloudburst',
    shape: 'smoke',
    stats: {
      radius: {
        max: 3.35,
        min: 3.35,
        unit: 'm',
      },
      duration: {
        value: 2.5,
        unit: 's',
      },
    },
  },
  updraft: {
    agent: 'Jett',
    ability: 'Updraft',
    shape: 'icon',
    stats: {
      distance: {
        value: 5,
        unit: 'm',
      },
      duration: {
        value: 0.6,
        unit: 's',
      },
    },
  },
  tailwind: {
    agent: 'Jett',
    ability: 'Tailwind',
    shape: 'path',
    stats: {
      width: {
        max: 2,
        min: 2,
        unit: 'm',
      },
      height: {
        max: 10,
        min: 2,
        unit: 'm',
      },
    },
  },
  blade_storm: {
    agent: 'Jett',
    ability: 'Blade Storm',
    shape: 'icon',
  },
};
