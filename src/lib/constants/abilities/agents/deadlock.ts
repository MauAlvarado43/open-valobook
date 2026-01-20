import { AbilityDefinition } from '@/lib/constants/abilities/base';

export const DeadlockAbilities: Record<string, AbilityDefinition> = {
  barrier_mesh: {
    agent: 'Deadlock',
    ability: 'Barrier Mesh',
    shape: 'wall',
    stats: {
      width: {
        max: 10,
        min: 10,
        unit: 'm',
      },
      height: {
        max: 10,
        min: 10,
        unit: 'm',
      },
      duration: {
        value: 30,
        unit: 's',
      },
    },
  },
  sonic_sensor: {
    agent: 'Deadlock',
    ability: 'Sonic Sensor',
    shape: 'path',
    stats: {
      height: {
        max: 9,
        min: 4.5,
        unit: 'm',
      },
      width: {
        max: 8,
        min: 8,
        unit: 'm',
      },
      duration: {
        value: 2.5,
        unit: 's',
      },
    },
  },
  gravnet: {
    agent: 'Deadlock',
    ability: 'GravNet',
    shape: 'area',
    stats: {
      radius: {
        max: 6.5,
        min: 6.5,
        unit: 'm',
      },
    },
  },
  annihilation: {
    agent: 'Deadlock',
    ability: 'Annihilation',
    shape: 'curved-wall',
    maxIntermediatePoints: 1,
    tension: 0,
    stats: {
      height: {
        max: 3,
        min: 3,
        unit: 'm',
      },
      width: {
        max: 40,
        min: 5,
        unit: 'm',
      },
    },
  },
};
