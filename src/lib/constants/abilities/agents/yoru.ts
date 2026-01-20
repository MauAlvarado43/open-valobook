import { AbilityDefinition } from '@/lib/constants/abilities/base';

export const YoruAbilities: Record<string, AbilityDefinition> = {
  FAKEOUT: {
    agent: 'Yoru',
    ability: 'Fakeout',
    shape: 'path',
    stats: {
      height: {
        value: 10,
        unit: 'm',
      },
      width: {
        value: 2,
        unit: 'm',
      },
      duration: {
        value: 10,
        unit: 's',
      },
    },
  },
  BLINDSIDE: {
    agent: 'Yoru',
    ability: 'Blindside',
    shape: 'icon',
    stats: {
      duration: {
        value: 1.5,
        unit: 's',
      },
    },
  },
  GATECRASH: {
    agent: 'Yoru',
    ability: 'Gatecrash',
    shape: 'icon',
    stats: {
      duration: {
        value: 30,
        unit: 's',
      },
    },
  },
  'DIMENSIONAL DRIFT': {
    agent: 'Yoru',
    ability: 'Dimensional Drift',
    shape: 'curved-wall',
    stats: {
      width: {
        value: 70,
        unit: 'm',
      },
      height: {
        value: 2,
        unit: 'm',
      },
      duration: {
        value: 10,
        unit: 's',
      },
    },
  },
};
