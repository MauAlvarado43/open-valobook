import { AbilityDefinition } from '@/lib/constants/abilities/base';

export const VetoAbilities: Record<string, AbilityDefinition> = {
  Crosscut: {
    agent: 'Veto',
    ability: 'Crosscut',
    shape: 'area',
    stats: {
      radius: {
        max: 24,
        min: 24,
        unit: 'm',
      },
    },
  },
  Chokehold: {
    agent: 'Veto',
    ability: 'Chokehold',
    shape: 'area',
    stats: {
      radius: {
        max: 6.58,
        min: 6.58,
        unit: 'm',
      },
      duration: {
        value: 4.5,
        unit: 's',
      },
    },
  },
  Interceptor: {
    agent: 'Veto',
    ability: 'Interceptor',
    shape: 'area',
    stats: {
      radius: {
        max: 18,
        min: 18,
        unit: 'm',
      },
      duration: {
        value: 9,
        unit: 's',
      },
    },
  },
  Evolution: {
    agent: 'Veto',
    ability: 'Evolution',
    shape: 'icon',
  },
};
