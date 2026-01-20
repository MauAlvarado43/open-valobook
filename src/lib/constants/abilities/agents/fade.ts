import { AbilityDefinition } from '@/lib/constants/abilities/base';

export const FadeAbilities: Record<string, AbilityDefinition> = {
  prowler: {
    agent: 'Fade',
    ability: 'Prowler',
    shape: 'curved-wall',
    tension: 0.3,
    stats: {
      height: {
        max: 7,
        min: 7,
        unit: 'm',
      },
      width: {
        max: 25,
        min: 10,
        unit: 'm',
      },
      duration: {
        value: 2.5,
        unit: 's',
      },
      speed: {
        value: 10,
        unit: 'm/s',
      },
    },
  },
  seize: {
    agent: 'Fade',
    ability: 'Seize',
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
  haunt: {
    agent: 'Fade',
    ability: 'Haunt',
    shape: 'area',
    stats: {
      radius: {
        max: 30,
        min: 30,
        unit: 'm',
      },
      duration: {
        value: 1.5,
        unit: 's',
      },
    },
  },
  nightfall: {
    agent: 'Fade',
    ability: 'Nightfall',
    shape: 'path',
    stats: {
      height: {
        max: 40,
        min: 40,
        unit: 'm',
      },
      width: {
        max: 20,
        min: 20,
        unit: 'm',
      },
      duration: {
        value: 8,
        unit: 's',
      },
    },
  },
};
