import { AbilityDefinition, AbilityShape } from './abilities/base';
import { AstraAbilities } from './abilities/agents/astra';
import { BreachAbilities } from './abilities/agents/breach';
import { BrimstoneAbilities } from './abilities/agents/brimstone';
import { ChamberAbilities } from './abilities/agents/chamber';
import { CloveAbilities } from './abilities/agents/clove';
import { CypherAbilities } from './abilities/agents/cypher';
import { DeadlockAbilities } from './abilities/agents/deadlock';
import { FadeAbilities } from './abilities/agents/fade';
import { GekkoAbilities } from './abilities/agents/gekko';
import { HarborAbilities } from './abilities/agents/harbor';
import { IsoAbilities } from './abilities/agents/iso';
import { JettAbilities } from './abilities/agents/jett';
import { KAYOAbilities } from './abilities/agents/kay-o';
import { KilljoyAbilities } from './abilities/agents/killjoy';
import { NeonAbilities } from './abilities/agents/neon';
import { OmenAbilities } from './abilities/agents/omen';
import { PhoenixAbilities } from './abilities/agents/phoenix';
import { RazeAbilities } from './abilities/agents/raze';
import { ReynaAbilities } from './abilities/agents/reyna';
import { SageAbilities } from './abilities/agents/sage';
import { SkyeAbilities } from './abilities/agents/skye';
import { SovaAbilities } from './abilities/agents/sova';
import { TejoAbilities } from './abilities/agents/tejo';
import { VetoAbilities } from './abilities/agents/veto';
import { ViperAbilities } from './abilities/agents/viper';
import { VyseAbilities } from './abilities/agents/vyse';
import { WaylayAbilities } from './abilities/agents/waylay';
import { YoruAbilities } from './abilities/agents/yoru';

export * from './abilities/base';

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
  ...YoruAbilities
};

export function getAbilityDefinition(key: string): AbilityDefinition | undefined {
  console.log(key)
  if (!key) return undefined;

  // Direct lookup
  if (ABILITY_DEFINITIONS[key]) return ABILITY_DEFINITIONS[key];

  // Icon path lookup (legacy support)
  if (key.includes('/') || key.includes('.png')) {
    return Object.values(ABILITY_DEFINITIONS).find(def => def.ability === key || (def as any).icon === key);
  }

  return undefined;
}

export const getAbilityShape = (name: string, description: string): AbilityShape => {
  const def = getAbilityDefinition(name);
  if (def) return def.shape;

  const desc = description.toLowerCase();
  const n = name.toLowerCase();

  // Wall/Divide priority to avoid Astra Ult description (which mentions stars making Nebulas) triggering 'smoke'
  if (desc.includes('wall') || n.includes('wall') || desc.includes('barrier') || n.includes('barrier') || desc.includes('divide') || n.includes('divide') || desc.includes('lane') || desc.includes('line') || desc.includes('muro')) return 'wall';

  if (desc.includes('smoke') || n.includes('smoke') || desc.includes('nebula') || desc.includes('sphere') || desc.includes('cloud')) return 'smoke';

  if (desc.includes('puddle') || desc.includes('area') || desc.includes('zone') || desc.includes('field') || desc.includes('stun') || desc.includes('molly')) return 'area';

  return 'icon';
};
