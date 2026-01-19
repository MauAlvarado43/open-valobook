import { AbilityDefinition } from '../base';

export const DeadlockAbilities: Record<string, AbilityDefinition> = {
  'Barrier Mesh': {
    agent: 'Deadlock',
    ability: 'Barrier Mesh',
    shape: 'wall',
    stats: {
      width: {
        max: 10,
        min: 10,
        unit: 'm'
      },
      height: {
        max: 10,
        min: 10,
        unit: 'm'
      },
      duration: {
        value: 30,
        unit: 's'
      }
    }
  },
  'Sonic Sensor': {
    agent: 'Deadlock',
    ability: 'Sonic Sensor',
    shape: 'path',
    stats: {
      height: {
        max: 9,
        min: 4.5,
        unit: 'm'
      },
      width: {
        max: 8,
        min: 8,
        unit: 'm'
      },
      duration: {
        value: 2.5,
        unit: 's'
      }
    }
  },
  'GravNet': {
    agent: 'Deadlock',
    ability: 'GravNet',
    shape: 'area',
    stats: {
      radius: {
        max: 6.5,
        min: 6.5,
        unit: 'm'
      },
    }
  },
  'Annihilation': {
    agent: 'Deadlock',
    ability: 'Annihilation',
    shape: 'curved-wall',
    intermediatePoints: 1,
    tension: 0,
    stats: {
      height: {
        max: 3,
        min: 3,
        unit: 'm'
      },
      width: {
        max: 40,
        min: 5,
        unit: 'm'
      },
    }
  }
};
