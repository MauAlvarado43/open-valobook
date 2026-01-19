import { AbilityDefinition } from '../base';

export const CypherAbilities: Record<string, AbilityDefinition> = {
  'Trapwire': {
    agent: 'Cypher',
    ability: 'Trapwire',
    shape: 'wall',
    stats: {
      height: {
        max: 2,
        min: 2,
        unit: 'm'
      },
      width: {
        max: 15,
        min: 1,
        unit: 'm'
      },
      duration: {
        value: 0.5,
        unit: 's'
      },
    }
  },
  'Cyber Cage': {
    agent: 'Cypher',
    ability: 'Cyber Cage',
    shape: 'smoke',
    stats: {
      radius: {
        max: 3.72,
        min: 3.72,
        unit: 'm'
      },
      duration: {
        value: 7.25,
        unit: 's'
      }
    }
  },
  'Spycam': {
    agent: 'Cypher',
    ability: 'Spycam',
    shape: 'icon',
  },
  'Neural Theft': {
    agent: 'Cypher',
    ability: 'Neural Theft',
    shape: 'icon',
  }
};
