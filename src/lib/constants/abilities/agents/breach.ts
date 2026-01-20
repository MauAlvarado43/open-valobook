import { AbilityDefinition } from '@/lib/constants/abilities/base';

export const BreachAbilities: Record<string, AbilityDefinition> = {
  aftershock: {
    agent: 'Breach',
    ability: 'Aftershock',
    shape: 'path',
    stats: {
      height: {
        max: 10,
        min: 3,
        unit: 'm',
      },
      width: {
        max: 3,
        min: 3,
        unit: 'm',
      },
      damage: {
        value: 80,
        unit: null,
      },
    },
  },
  fault_line: {
    agent: 'Breach',
    ability: 'Fault Line',
    shape: 'path',
    stats: {
      height: {
        max: 56,
        min: 8,
        unit: 'm',
      },
      width: {
        max: 8,
        min: 8,
        unit: 'm',
      },
      duration: {
        value: 2.5,
        unit: 's',
      },
    },
  },
  flashpoint: {
    agent: 'Breach',
    ability: 'Flashpoint',
    shape: 'icon',
    stats: {
      duration: {
        value: 2.25,
        unit: 's',
      },
    },
  },
  rolling_thunder: {
    agent: 'Breach',
    ability: 'Rolling Thunder',
    shape: 'path',
    stats: {
      height: {
        max: 32,
        min: 32,
        unit: 'm',
      },
      width: {
        max: 18,
        min: 18,
        unit: 'm',
      },
      duration: {
        value: 4,
        unit: 's',
      },
    },
  },
};
