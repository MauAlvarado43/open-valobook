import { AbilityDefinition, AbilityShape } from '@/lib/constants/abilities/base';
import { slugifyAbilityName } from '@/lib/utils/stringUtils';
import { AstraAbilities } from '@/lib/constants/abilities/agents/astra';
import { BreachAbilities } from '@/lib/constants/abilities/agents/breach';
import { BrimstoneAbilities } from '@/lib/constants/abilities/agents/brimstone';
import { ChamberAbilities } from '@/lib/constants/abilities/agents/chamber';
import { CloveAbilities } from '@/lib/constants/abilities/agents/clove';
import { CypherAbilities } from '@/lib/constants/abilities/agents/cypher';
import { DeadlockAbilities } from '@/lib/constants/abilities/agents/deadlock';
import { FadeAbilities } from '@/lib/constants/abilities/agents/fade';
import { GekkoAbilities } from '@/lib/constants/abilities/agents/gekko';
import { HarborAbilities } from '@/lib/constants/abilities/agents/harbor';
import { IsoAbilities } from '@/lib/constants/abilities/agents/iso';
import { JettAbilities } from '@/lib/constants/abilities/agents/jett';
import { KAYOAbilities } from '@/lib/constants/abilities/agents/kay-o';
import { KilljoyAbilities } from '@/lib/constants/abilities/agents/killjoy';
import { NeonAbilities } from '@/lib/constants/abilities/agents/neon';
import { OmenAbilities } from '@/lib/constants/abilities/agents/omen';
import { PhoenixAbilities } from '@/lib/constants/abilities/agents/phoenix';
import { RazeAbilities } from '@/lib/constants/abilities/agents/raze';
import { ReynaAbilities } from '@/lib/constants/abilities/agents/reyna';
import { SageAbilities } from '@/lib/constants/abilities/agents/sage';
import { SkyeAbilities } from '@/lib/constants/abilities/agents/skye';
import { SovaAbilities } from '@/lib/constants/abilities/agents/sova';
import { TejoAbilities } from '@/lib/constants/abilities/agents/tejo';
import { VetoAbilities } from '@/lib/constants/abilities/agents/veto';
import { ViperAbilities } from '@/lib/constants/abilities/agents/viper';
import { VyseAbilities } from '@/lib/constants/abilities/agents/vyse';
import { WaylayAbilities } from '@/lib/constants/abilities/agents/waylay';
import { YoruAbilities } from '@/lib/constants/abilities/agents/yoru';

export * from '@/lib/constants/abilities/base';

export const ABILITY_DEFINITIONS: Record<string, AbilityDefinition> = {
  ...AstraAbilities,
  ...BreachAbilities,
  ...BrimstoneAbilities,
  ...ChamberAbilities,
  ...CloveAbilities,
  ...CypherAbilities,
  ...DeadlockAbilities,
  ...FadeAbilities,
  ...GekkoAbilities,
  ...HarborAbilities,
  ...IsoAbilities,
  ...JettAbilities,
  ...KAYOAbilities,
  ...KilljoyAbilities,
  ...NeonAbilities,
  ...OmenAbilities,
  ...PhoenixAbilities,
  ...RazeAbilities,
  ...ReynaAbilities,
  ...SageAbilities,
  ...SkyeAbilities,
  ...SovaAbilities,
  ...TejoAbilities,
  ...VetoAbilities,
  ...ViperAbilities,
  ...VyseAbilities,
  ...WaylayAbilities,
  ...YoruAbilities,
};

export function getAbilityDefinition(key: string): AbilityDefinition | undefined {
  if (!key) return undefined;

  // Slugified lookup (normalized)
  const slug = slugifyAbilityName(key);
  if (ABILITY_DEFINITIONS[slug]) return ABILITY_DEFINITIONS[slug];

  // Direct lookup (legacy or manual)
  if (ABILITY_DEFINITIONS[key]) return ABILITY_DEFINITIONS[key];

  // Icon path lookup (legacy support)
  if (key.includes('/') || key.includes('.png')) {
    return Object.values(ABILITY_DEFINITIONS).find((def) => def.ability === key);
  }

  return undefined;
}

export const getAbilityShape = (name: string, description: string): AbilityShape => {
  const def = getAbilityDefinition(name);
  if (def) return def.shape;

  const desc = (description || '').toLowerCase();
  const n = (name || '').toLowerCase();

  // Wall/Divide priority to avoid Astra Ult description (which mentions stars making Nebulas) triggering 'smoke'
  if (
    desc.includes('wall') ||
    n.includes('wall') ||
    desc.includes('barrier') ||
    n.includes('barrier') ||
    desc.includes('divide') ||
    n.includes('divide') ||
    desc.includes('lane') ||
    desc.includes('line') ||
    desc.includes('muro')
  )
    return 'wall';

  if (
    desc.includes('smoke') ||
    n.includes('smoke') ||
    desc.includes('nebula') ||
    desc.includes('sphere') ||
    desc.includes('cloud')
  )
    return 'smoke';

  if (
    desc.includes('puddle') ||
    desc.includes('area') ||
    desc.includes('zone') ||
    desc.includes('field') ||
    desc.includes('stun') ||
    desc.includes('molly')
  )
    return 'area';

  return 'icon';
};
