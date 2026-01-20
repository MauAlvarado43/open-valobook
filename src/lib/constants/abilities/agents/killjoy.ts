import { AbilityDefinition } from '@/lib/constants/abilities/base';

export const KilljoyAbilities: Record<string, AbilityDefinition> = {
  nanoswarm: {
    agent: 'Killjoy',
    ability: 'Nanoswarm',
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
  alarmbot: {
    agent: 'Killjoy',
    ability: 'Alarmbot',
    shape: 'area',
    stats: {
      radius: {
        max: 40,
        min: 40,
        unit: 'm',
      },
      innerRadius: {
        max: 5.5,
        min: 5.5,
        unit: 'm',
      },
    },
  },
  turret: {
    agent: 'Killjoy',
    ability: 'Turret',
    shape: 'area',
    stats: {
      radius: {
        max: 40,
        min: 40,
        unit: 'm',
      },
    },
  },
  lockdown: {
    agent: 'Killjoy',
    ability: 'Lockdown',
    shape: 'area',
    stats: {
      radius: {
        max: 32.5,
        min: 32.5,
        unit: 'm',
      },
      duration: {
        value: 8,
        unit: 's',
      },
    },
  },
};
