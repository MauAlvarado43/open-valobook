import { AbilityDefinition } from '@/lib/constants/abilities/base';

export const SageAbilities: Record<string, AbilityDefinition> = {
  'Barrier Orb': {
    agent: 'Sage',
    ability: 'Barrier Orb',
    shape: 'wall',
    stats: {
      width: {
        max: 15,
        min: 5,
        unit: 'm',
      },
      height: {
        max: 2,
        min: 2,
        unit: 'm',
      },
      duration: {
        value: 40,
        unit: 's',
      },
    },
  },
  'Slow Orb': {
    agent: 'Sage',
    ability: 'Slow Orb',
    shape: 'area',
    stats: {
      radius: {
        max: 10,
        min: 10,
        unit: 'm',
      },
      duration: {
        value: 7,
        unit: 's',
      },
    },
  },
  'Healing Orb': {
    agent: 'Sage',
    ability: 'Healing Orb',
    shape: 'area',
    stats: {
      radius: {
        max: 10,
        min: 3,
        unit: 'm',
      },
      duration: {
        value: 5,
        unit: 's',
      },
    },
  },
  Resurrection: {
    agent: 'Sage',
    ability: 'Resurrection',
    shape: 'area',
    stats: {
      radius: {
        max: 12,
        min: 3,
        unit: 'm',
      },
      duration: {
        value: 1.3,
        unit: 's',
      },
    },
  },
};
