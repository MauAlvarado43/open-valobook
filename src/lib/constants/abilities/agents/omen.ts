import { AbilityDefinition } from '@/lib/constants/abilities/base';

export const OmenAbilities: Record<string, AbilityDefinition> = {
  shrouded_step: {
    agent: 'Omen',
    ability: 'Shrouded Step',
    shape: 'path',
    stats: {
      height: {
        max: 15,
        min: 3,
        unit: 'm',
      },
      width: {
        max: 2,
        min: 2,
        unit: 'm',
      },
      duration: {
        value: 1.2,
        unit: 's',
      },
    },
  },
  paranoia: {
    agent: 'Omen',
    ability: 'Paranoia',
    shape: 'path',
    stats: {
      height: {
        max: 25,
        min: 25,
        unit: 'm',
      },
      width: {
        max: 4.3,
        min: 4.3,
        unit: 'm',
      },
      speed: {
        value: 20,
        unit: 'm/s',
      },
      duration: {
        value: 2,
        unit: 's',
      },
    },
  },
  dark_cover: {
    agent: 'Omen',
    ability: 'Dark Cover',
    shape: 'smoke',
    stats: {
      radius: {
        max: 4.1,
        min: 4.1,
        unit: 'm',
      },
      duration: {
        value: 15,
        unit: 's',
      },
    },
  },
  from_the_shadows: {
    agent: 'Omen',
    ability: 'From the Shadows',
    shape: 'icon',
  },
};
