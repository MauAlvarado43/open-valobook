import { AbilityDefinition } from '@/lib/constants/abilities/base';

export const SovaAbilities: Record<string, AbilityDefinition> = {
  'Owl Drone': {
    agent: 'Sova',
    ability: 'Owl Drone',
    shape: 'curved-wall',
    stats: {
      width: {
        max: 40,
        min: 10,
        unit: 'm',
      },
      height: {
        max: 2,
        min: 2,
        unit: 'm',
      },
      duration: {
        value: 7,
        unit: 's',
      },
    },
  },
  'Shock Bolt': {
    agent: 'Sova',
    ability: 'Shock Bolt',
    shape: 'area',
    stats: {
      radius: {
        max: 4,
        min: 4,
        unit: 'm',
      },
    },
  },
  'Recon Bolt': {
    agent: 'Sova',
    ability: 'Recon Bolt',
    shape: 'area',
    stats: {
      radius: {
        max: 30,
        min: 30,
        unit: 'm',
      },
      duration: {
        value: 3.2,
        unit: 's',
      },
    },
  },
  "Hunter's Fury": {
    agent: 'Sova',
    ability: "Hunter's Fury",
    shape: 'path',
    stats: {
      height: {
        max: 66,
        min: 66,
        unit: 'm',
      },
      width: {
        max: 3.52,
        min: 3.52,
        unit: 'm',
      },
      duration: {
        value: 6,
        unit: 's',
      },
    },
  },
};
