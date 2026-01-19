import { AbilityDefinition } from '../base';

export const OmenAbilities: Record<string, AbilityDefinition> = {
  'Shrouded Step': {
    agent: 'Omen',
    ability: 'Shrouded Step',
    shape: 'path',
    stats: {
      height: {
        max: 15,
        min: 3,
        unit: 'm'
      },
      width: {
        max: 2,
        min: 2,
        unit: 'm'
      },
      duration: {
        value: 1.2,
        unit: 's'
      },
    }
  },
  'Paranoia': {
    agent: 'Omen',
    ability: 'Paranoia',
    shape: 'path',
    stats: {
      height: {
        max: 25,
        min: 25,
        unit: 'm'
      },
      width: {
        max: 4.3,
        min: 4.3,
        unit: 'm'
      },
      speed: {
        value: 20,
        unit: 'm/s'
      },
      duration: {
        value: 2,
        unit: 's'
      }
    }
  },
  'Dark Cover': {
    agent: 'Omen',
    ability: 'Dark Cover',
    shape: 'smoke',
    stats: {
      radius: {
        max: 4.1,
        min: 4.1,
        unit: 'm'
      },
      duration: {
        value: 15,
        unit: 's'
      },
    }
  },
  'From the Shadows': {
    agent: 'Omen',
    ability: 'From the Shadows',
    shape: 'icon',
  }
};
