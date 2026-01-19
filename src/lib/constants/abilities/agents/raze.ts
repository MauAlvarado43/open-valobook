import { AbilityDefinition } from '../base';

export const RazeAbilities: Record<string, AbilityDefinition> = {
  'Boom Bot': {
    agent: 'Raze',
    ability: 'Boom Bot',
    shape: 'curved-wall',
    stats: {
      height: {
        max: 2,
        min: 2,
        unit: 'm'
      },
      width: {
        max: 30,
        min: 5,
        unit: 'm'
      },
    }
  },
  'Blast Pack': {
    agent: 'Raze',
    ability: 'Blast Pack',
    shape: 'area',
    stats: {
      duration: {
        value: 5,
        unit: 's'
      },
      radius: {
        max: 2,
        min: 2,
        unit: 'm'
      },
    }
  },
  'Paint Shells': {
    agent: 'Raze',
    ability: 'Paint Shells',
    shape: 'area',
    stats: {
      radius: {
        max: 5.25,
        min: 5.25,
        unit: 'm'
      },
    }
  },
  'Showstopper': {
    agent: 'Raze',
    ability: 'Showstopper',
    shape: 'area',
    stats: {
      radius: {
        max: 7,
        min: 7,
        unit: 'm'
      },
      duration: {
        value: 10,
        unit: 's'
      },
    }
  },
};
