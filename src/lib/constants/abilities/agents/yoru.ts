import { AbilityDefinition } from '@/lib/constants/abilities/base';

export const YoruAbilities: Record<string, AbilityDefinition> = {
  fakeout: {
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
  blindside: {
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
  gatecrash: {
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
  dimensional_drift: {
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
