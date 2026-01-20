import { AbilityDefinition } from '@/lib/constants/abilities/base';

export const AstraAbilities: Record<string, AbilityDefinition> = {
  gravity_well: {
    agent: 'Astra',
    ability: 'Gravity Well',
    shape: 'area',
    stats: {
      radius: {
        max: 4.75,
        min: 4.75,
        unit: 'm',
      },
      duration: {
        value: 2,
        unit: 's',
      },
    },
  },
  nova_pulse: {
    agent: 'Astra',
    ability: 'Nova Pulse',
    shape: 'area',
    stats: {
      radius: {
        max: 4.75,
        min: 4.75,
        unit: 'm',
      },
      duration: {
        value: 2.5,
        unit: 's',
      },
    },
  },
  nebula_dissipate: {
    agent: 'Astra',
    ability: 'Nebula',
    shape: 'smoke',
    stats: {
      radius: {
        max: 4.75,
        min: 4.75,
        unit: 'm',
      },
      duration: {
        value: 14.25,
        unit: 's',
      },
    },
  },
  astral_form_cosmic_divide: {
    agent: 'Astra',
    ability: 'Cosmic Divide',
    shape: 'wall',
    stats: {
      width: {
        max: 250,
        min: 25,
        unit: 'm',
      },
      height: {
        max: 2,
        min: 2,
        unit: 'm',
      },
      duration: {
        value: 21,
        unit: 's',
      },
    },
  },
};
