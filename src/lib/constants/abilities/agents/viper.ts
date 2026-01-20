import { AbilityDefinition } from '@/lib/constants/abilities/base';

export const ViperAbilities: Record<string, AbilityDefinition> = {
  snake_bite: {
    agent: 'Viper',
    ability: 'Snake Bite',
    shape: 'area',
    stats: {
      radius: {
        max: 4.5,
        min: 4.5,
        unit: 'm',
      },
      duration: {
        value: 6.5,
        unit: 's',
      },
    },
  },
  poison_cloud: {
    agent: 'Viper',
    ability: 'Poison Cloud',
    shape: 'smoke',
    stats: {
      radius: {
        max: 4.5,
        min: 4.5,
        unit: 'm',
      },
    },
  },
  toxic_screen: {
    agent: 'Viper',
    ability: 'Toxic Screen',
    shape: 'wall',
    stats: {
      width: {
        max: 60,
        min: 10,
        unit: 'm',
      },
      height: {
        max: 2,
        min: 2,
        unit: 'm',
      },
    },
  },
  vipers_pit: {
    agent: 'Viper',
    ability: "Viper's Pit",
    shape: 'area',
    stats: {
      radius: {
        max: 9,
        min: 9,
        unit: 'm',
      },
    },
  },
};
