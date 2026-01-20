import { AbilityDefinition } from '@/lib/constants/abilities/base';

export const ChamberAbilities: Record<string, AbilityDefinition> = {
  trademark: {
    agent: 'Chamber',
    ability: 'Trademark',
    shape: 'area',
    stats: {
      radius: {
        max: 10,
        min: 10,
        unit: 'm',
      },
    },
  },
  headhunter: {
    agent: 'Chamber',
    ability: 'Headhunter',
    shape: 'icon',
  },
  rendezvous: {
    agent: 'Chamber',
    ability: 'Rendezvous',
    shape: 'area',
    stats: {
      radius: {
        max: 18,
        min: 18,
        unit: 'm',
      },
      duration: {
        value: 1.3,
        unit: 's',
      },
    },
  },
  tour_de_force: {
    agent: 'Chamber',
    ability: 'Tour De Force',
    shape: 'icon',
  },
};
