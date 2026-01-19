import { AbilityDefinition } from '../base';

export const ChamberAbilities: Record<string, AbilityDefinition> = {
  'Trademark': {
    agent: 'Chamber',
    ability: 'Trademark',
    shape: 'area',
    stats: {
      radius: {
        max: 10,
        min: 10,
        unit: 'm'
      },
    }
  },
  'Headhunter': {
    agent: 'Chamber',
    ability: 'Headhunter',
    shape: 'icon'
  },
  'Rendezvous': {
    agent: 'Chamber', ability: 'Rendezvous', shape: 'area', stats: {
      radius: {
        max: 18,
        min: 18,
        unit: 'm'
      },
      duration: {
        value: 1.3,
        unit: 's'
      },
    }
  },
  'Tour De Force': {
    agent: 'Chamber',
    ability: 'Tour De Force',
    shape: 'icon'
  },
};
