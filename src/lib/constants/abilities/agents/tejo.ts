import { AbilityDefinition } from '@/lib/constants/abilities/base';

export const TejoAbilities: Record<string, AbilityDefinition> = {
  stealth_drone: {
    agent: 'Tejo',
    ability: 'Stealth Drone',
    shape: 'curved-wall',
    stats: {
      width: {
        max: 50,
        min: 50,
        unit: 'm',
      },
      height: {
        max: 2,
        min: 2,
        unit: 'm',
      },
      duration: {
        value: 6,
        unit: 's',
      },
    },
  },
  special_delivery: {
    agent: 'Tejo',
    ability: 'Special Delivery',
    shape: 'area',
    stats: {
      duration: {
        value: 3,
        unit: 's',
      },
      radius: {
        max: 5.25,
        min: 5.25,
        unit: 'm',
      },
    },
  },
  guided_salvo: {
    agent: 'Tejo',
    ability: 'Guided Salvo',
    shape: 'area',
    stats: {
      radius: {
        max: 4.5,
        min: 4.5,
        unit: 'm',
      },
    },
  },
  armageddon: {
    agent: 'Tejo',
    ability: 'Armageddon',
    shape: 'path',
    stats: {
      height: {
        max: 32,
        min: 32,
        unit: 'm',
      },
      width: {
        max: 10,
        min: 10,
        unit: 'm',
      },
      duration: {
        value: 3,
        unit: 's',
      },
    },
  },
};
