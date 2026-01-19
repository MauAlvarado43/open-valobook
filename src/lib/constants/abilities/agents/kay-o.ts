import { AbilityDefinition } from '../base';

export const KAYOAbilities: Record<string, AbilityDefinition> = {
  'FRAG/ment': {
    agent: 'KAY/O',
    ability: 'FRAG/ment',
    shape: 'area',
    stats: {
      radius: {
        max: 4,
        min: 4,
        unit: 'm'
      },
      duration: {
        value: 4,
        unit: 's'
      }
    }
  },
  'FLASH/drive': {
    agent: 'KAY/O',
    ability: 'FLASH/drive',
    shape: 'icon',
    stats: {
      duration: {
        value: 2.25,
        unit: 's'
      }
    }
  },
  'ZERO/point': {
    agent: 'KAY/O',
    ability: 'ZERO/point',
    shape: 'area',
    stats: {
      radius: {
        max: 15,
        min: 15,
        unit: 'm'
      },
      duration: {
        value: 8,
        unit: 's'
      }
    }
  },
  'NULL/cmd': {
    agent: 'KAY/O',
    ability: 'NULL/cmd',
    shape: 'area',
    stats: {
      radius: {
        max: 42.5,
        min: 42.5,
        unit: 'm'
      },
      duration: {
        value: 4,
        unit: 's'
      },
    }
  }
};
