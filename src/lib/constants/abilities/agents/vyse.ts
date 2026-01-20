import { AbilityDefinition } from '@/lib/constants/abilities/base';

export const VyseAbilities: Record<string, AbilityDefinition> = {
  razorvine: {
    agent: 'Vyse',
    ability: 'Razorvine',
    shape: 'area',
    stats: {
      radius: {
        max: 6.25,
        min: 6.25,
        unit: 'm',
      },
      duration: {
        value: 6,
        unit: 's',
      },
    },
  },
  shear: {
    agent: 'Vyse',
    ability: 'Shear',
    shape: 'wall',
    stats: {
      width: {
        max: 12,
        min: 3,
        unit: 'm',
      },
      height: {
        max: 2,
        min: 2,
        unit: 'm',
      },
      duration: {
        value: 6,
        unit: 's',
      },
    },
  },
  arc_rose: {
    agent: 'Vyse',
    ability: 'Arc Rose',
    shape: 'area',
    stats: {
      height: {
        value: 4.5,
        unit: 'm',
      },
      radius: {
        max: 32.5,
        min: 32.5,
        unit: 'm',
      },
      duration: {
        value: 2,
        unit: 's',
      },
    },
  },
  steel_garden: {
    agent: 'Vyse',
    ability: 'Steel Garden',
    shape: 'area',
    stats: {
      radius: {
        max: 28,
        min: 28,
        unit: 'm',
      },
      duration: {
        value: 8,
        unit: 's',
      },
    },
  },
};
