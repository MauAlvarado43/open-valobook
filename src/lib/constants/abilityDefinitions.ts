export type AbilityShape = 'smoke' | 'wall' | 'curved-wall' | 'rect' | 'area' | 'path' | 'icon' | 'guided-path';

export interface AbilityDefinition {
  agent: string;
  ability: string; // name or slot
  shape: AbilityShape;
  defaultRadius?: number;
  defaultWidth?: number;
  defaultHeight?: number;
  maxDistance?: number; // For guided-path abilities
  isGlobal?: boolean; // For things like Astra Ult
  intermediatePoints?: number; // For curved-wall: number of intermediate points (default: 3)
  tension?: number; // For curved-wall: 0 = straight lines, 0.3 = smooth curves (default: 0.3)
}

/**
 * Mapping of specialized ability representations for high accuracy.
 * Icons not listed here will fall back to 'icon' (default).
 */
export const ABILITY_DEFINITIONS: Record<string, AbilityDefinition> = {
  // Astra
  'Cosmic Divide': { agent: 'Astra', ability: 'Cosmic Divide', shape: 'wall', defaultWidth: 600 },
  'Gravity Well': { agent: 'Astra', ability: 'Gravity Well', shape: 'area', defaultRadius: 40 },
  'Nebula': { agent: 'Astra', ability: 'Nebula', shape: 'smoke', defaultRadius: 60 },
  'Nova Pulse': { agent: 'Astra', ability: 'Nova Pulse', shape: 'area', defaultRadius: 50 },

  // Breach
  'Flashpoint': { agent: 'Breach', ability: 'Flashpoint', shape: 'icon' },
  'Aftershock': { agent: 'Breach', ability: 'Aftershock', shape: 'path', defaultWidth: 30, defaultHeight: 50 },
  'Fault Line': { agent: 'Breach', ability: 'Fault Line', shape: 'path', defaultWidth: 40, defaultHeight: 150 },
  'Rolling Thunder': { agent: 'Breach', ability: 'Rolling Thunder', shape: 'path', defaultWidth: 80, defaultHeight: 250 },

  // Brimstone
  'Incendiary': { agent: 'Brimstone', ability: 'Incendiary', shape: 'area', defaultRadius: 40 },
  'Orbital Strike': { agent: 'Brimstone', ability: 'Orbital Strike', shape: 'area', defaultRadius: 80 },
  'Sky Smoke': { agent: 'Brimstone', ability: 'Sky Smoke', shape: 'smoke', defaultRadius: 60 },
  'Stim Beacon': { agent: 'Brimstone', ability: 'Stim Beacon', shape: 'area', defaultRadius: 50 },

  // Chamber
  'Headhunter': { agent: 'Chamber', ability: 'Headhunter', shape: 'icon' },
  'Rendezvous': { agent: 'Chamber', ability: 'Rendezvous', shape: 'area', defaultRadius: 60 },
  'Tour De Force': { agent: 'Chamber', ability: 'Tour De Force', shape: 'icon' },
  'Trademark': { agent: 'Chamber', ability: 'Trademark', shape: 'area', defaultRadius: 40 },

  // Clove
  'Pick-me-up': { agent: 'Clove', ability: 'Pick-me-up', shape: 'icon' },
  'Ruse': { agent: 'Clove', ability: 'Ruse', shape: 'smoke', defaultRadius: 60 },
  'Meddle': { agent: 'Clove', ability: 'Meddle', shape: 'area', defaultRadius: 100 },
  'Not Dead Yet': { agent: 'Clove', ability: 'Not Dead Yet', shape: 'icon' },

  // Cypher
  'Cyber Cage': { agent: 'Cypher', ability: 'Cyber Cage', shape: 'smoke', defaultRadius: 50 },
  'Spycam': { agent: 'Cypher', ability: 'Spycam', shape: 'icon' },
  'Trapwire': { agent: 'Cypher', ability: 'Trapwire', shape: 'wall', defaultWidth: 150 },
  'Neural Theft': { agent: 'Cypher', ability: 'Neural Theft', shape: 'icon' },

  // Deadlock
  'Sonic Sensor': { agent: 'Deadlock', ability: 'Sonic Sensor', shape: 'area', defaultRadius: 60 },
  'Barrier Mesh': { agent: 'Deadlock', ability: 'Barrier Mesh', shape: 'wall', defaultWidth: 200 },
  'GravNet': { agent: 'Deadlock', ability: 'GravNet', shape: 'area', defaultRadius: 50 },
  'Annihilation': { agent: 'Deadlock', ability: 'Annihilation', shape: 'curved-wall', defaultWidth: 60, defaultHeight: 100, intermediatePoints: 1, tension: 0 },

  // Fade
  'Haunt': { agent: 'Fade', ability: 'Haunt', shape: 'area', defaultRadius: 50 },
  'Seize': { agent: 'Fade', ability: 'Seize', shape: 'area', defaultRadius: 40 },
  'Prowler': { agent: 'Fade', ability: 'Prowler', shape: 'icon' },
  'Nightfall': { agent: 'Fade', ability: 'Nightfall', shape: 'path', defaultWidth: 80, defaultHeight: 200 },

  // Gekko
  'Wingman': { agent: 'Gekko', ability: 'Wingman', shape: 'icon' },
  'Dizzy': { agent: 'Gekko', ability: 'Dizzy', shape: 'icon' },
  'Mosh Pit': { agent: 'Gekko', ability: 'Mosh Pit', shape: 'area', defaultRadius: 60 },
  'Thrash': { agent: 'Gekko', ability: 'Thrash', shape: 'icon' },

  // Harbor
  'Cove': { agent: 'Harbor', ability: 'Cove', shape: 'smoke', defaultRadius: 60 },
  'High Tide': { agent: 'Harbor', ability: 'High Tide', shape: 'curved-wall', defaultWidth: 300, intermediatePoints: 3, tension: 0.3 },
  'Reckoning': { agent: 'Harbor', ability: 'Reckoning', shape: 'path', defaultWidth: 80, defaultHeight: 200 },
  'Storm Surge': { agent: 'Harbor', ability: 'Storm Surge', shape: 'area', defaultRadius: 80 },

  // Iso
  'Undercut': { agent: 'Iso', ability: 'Undercut', shape: 'path', defaultWidth: 25, defaultHeight: 100 },
  'Double Tap': { agent: 'Iso', ability: 'Double Tap', shape: 'icon' },
  'Kill Contract': { agent: 'Iso', ability: 'Kill Contract', shape: 'path', defaultWidth: 80, defaultHeight: 200 },
  'Contingency': { agent: 'Iso', ability: 'Contingency', shape: 'path', defaultWidth: 50, defaultHeight: 120 },

  // Jett
  'Blade Storm': { agent: 'Jett', ability: 'Blade Storm', shape: 'icon' },
  'Cloudburst': { agent: 'Jett', ability: 'Cloudburst', shape: 'smoke', defaultRadius: 40 },
  'Tailwind': { agent: 'Jett', ability: 'Tailwind', shape: 'icon' },
  'Updraft': { agent: 'Jett', ability: 'Updraft', shape: 'icon' },

  // KAY/O
  'FRAG/ment': { agent: 'KAY/O', ability: 'FRAG/ment', shape: 'area', defaultRadius: 50 },
  'FLASH/drive': { agent: 'KAY/O', ability: 'FLASH/drive', shape: 'icon' },
  'ZERO/point': { agent: 'KAY/O', ability: 'ZERO/point', shape: 'area', defaultRadius: 80 },
  'NULL/cmd': { agent: 'KAY/O', ability: 'NULL/cmd', shape: 'area', defaultRadius: 100 },

  // Killjoy
  'Lockdown': { agent: 'Killjoy', ability: 'Lockdown', shape: 'area', defaultRadius: 150 },
  'Nanoswarm': { agent: 'Killjoy', ability: 'Nanoswarm', shape: 'area', defaultRadius: 45 },
  'Alarmbot': { agent: 'Killjoy', ability: 'Alarmbot', shape: 'area', defaultRadius: 45 },
  'Turret': { agent: 'Killjoy', ability: 'Turret', shape: 'icon' },

  // Neon
  'Fast Lane': { agent: 'Neon', ability: 'Fast Lane', shape: 'wall', defaultWidth: 120 },
  'Overdrive': { agent: 'Neon', ability: 'Overdrive', shape: 'icon' },
  'Relay Bolt': { agent: 'Neon', ability: 'Relay Bolt', shape: 'area', defaultRadius: 45 },
  'High Gear': { agent: 'Neon', ability: 'High Gear', shape: 'icon' },

  // Omen
  'Dark Cover': { agent: 'Omen', ability: 'Dark Cover', shape: 'smoke', defaultRadius: 60 },
  'Paranoia': { agent: 'Omen', ability: 'Paranoia', shape: 'path', defaultWidth: 60, defaultHeight: 150 },
  'Shrouded Step': { agent: 'Omen', ability: 'Shrouded Step', shape: 'icon' },
  'From the Shadows': { agent: 'Omen', ability: 'From the Shadows', shape: 'icon' },

  // Phoenix
  'Blaze': { agent: 'Phoenix', ability: 'Blaze', shape: 'wall', defaultWidth: 100 },
  'Hot Hands': { agent: 'Phoenix', ability: 'Hot Hands', shape: 'area', defaultRadius: 40 },
  'Curveball': { agent: 'Phoenix', ability: 'Curveball', shape: 'icon' },
  'Run it Back': { agent: 'Phoenix', ability: 'Run it Back', shape: 'icon' },

  // Raze
  'Paint Shells': { agent: 'Raze', ability: 'Paint Shells', shape: 'area', defaultRadius: 60 },
  'Showstopper': { agent: 'Raze', ability: 'Showstopper', shape: 'icon' },
  'Blast Pack': { agent: 'Raze', ability: 'Blast Pack', shape: 'icon' },
  'Boom Bot': { agent: 'Raze', ability: 'Boom Bot', shape: 'icon' },

  // Reyna
  'Devour': { agent: 'Reyna', ability: 'Devour', shape: 'icon' },
  'Dismiss': { agent: 'Reyna', ability: 'Dismiss', shape: 'icon' },
  'Leer': { agent: 'Reyna', ability: 'Leer', shape: 'icon' },
  'Empress': { agent: 'Reyna', ability: 'Empress', shape: 'icon' },

  // Sage
  'Barrier Orb': { agent: 'Sage', ability: 'Barrier Orb', shape: 'wall', defaultWidth: 50 },
  'Slow Orb': { agent: 'Sage', ability: 'Slow Orb', shape: 'area', defaultRadius: 60 },
  'Healing Orb': { agent: 'Sage', ability: 'Healing Orb', shape: 'icon' },
  'Resurrection': { agent: 'Sage', ability: 'Resurrection', shape: 'icon' },

  // Skye
  'Trailblazer': { agent: 'Skye', ability: 'Trailblazer', shape: 'icon' },
  'Guiding Light': { agent: 'Skye', ability: 'Guiding Light', shape: 'icon' },
  'Regrowth': { agent: 'Skye', ability: 'Regrowth', shape: 'icon' },
  'Seekers': { agent: 'Skye', ability: 'Seekers', shape: 'icon' },

  // Sova
  'Hunter\'s Fury': { agent: 'Sova', ability: 'Hunter\'s Fury', shape: 'path', defaultWidth: 40, defaultHeight: 250 },
  'Recon Bolt': { agent: 'Sova', ability: 'Recon Bolt', shape: 'area', defaultRadius: 80 },
  'Shock Bolt': { agent: 'Sova', ability: 'Shock Bolt', shape: 'area', defaultRadius: 40 },
  'Owl Drone': { agent: 'Sova', ability: 'Owl Drone', shape: 'icon' },

  // Tejo
  'Corriente': { agent: 'Tejo', ability: 'Corriente', shape: 'path', defaultWidth: 60, defaultHeight: 250 },
  'Guided Salvo': { agent: 'Tejo', ability: 'Guided Salvo', shape: 'icon' },
  'Special Delivery': { agent: 'Tejo', ability: 'Special Delivery', shape: 'area', defaultRadius: 60 },
  'Armageddon': { agent: 'Tejo', ability: 'Armageddon', shape: 'path', defaultWidth: 80, defaultHeight: 200 },

  // Veto
  'Interceptor': { agent: 'Veto', ability: 'Interceptor', shape: 'icon' },
  'Crosscut': { agent: 'Veto', ability: 'Crosscut', shape: 'wall', defaultWidth: 200 },
  'Evolution': { agent: 'Veto', ability: 'Evolution', shape: 'icon' },
  'Chokehold': { agent: 'Veto', ability: 'Chokehold', shape: 'area', defaultRadius: 80 },

  // Viper
  'Poison Cloud': { agent: 'Viper', ability: 'Poison Cloud', shape: 'smoke', defaultRadius: 60 },
  'Snake Bite': { agent: 'Viper', ability: 'Snake Bite', shape: 'area', defaultRadius: 40 },
  'Toxic Screen': { agent: 'Viper', ability: 'Toxic Screen', shape: 'wall', defaultWidth: 400 },
  'Viper\'s Pit': { agent: 'Viper', ability: 'Viper\'s Pit', shape: 'area', defaultRadius: 120 },

  // Vyse
  'Shear': { agent: 'Vyse', ability: 'Shear', shape: 'wall', defaultWidth: 150 },
  'Arc Rose': { agent: 'Vyse', ability: 'Arc Rose', shape: 'area', defaultRadius: 50 },
  'Razorvine': { agent: 'Vyse', ability: 'Razorvine', shape: 'wall', defaultWidth: 200 },
  'Steel Garden': { agent: 'Vyse', ability: 'Steel Garden', shape: 'area', defaultRadius: 120 },

  // Waylay
  'Saturate': { agent: 'Waylay', ability: 'Saturate', shape: 'area', defaultRadius: 40 },
  'Convergent Paths': { agent: 'Waylay', ability: 'Convergent Paths', shape: 'path', defaultWidth: 80, defaultHeight: 200 },
  'Refract': { agent: 'Waylay', ability: 'Refract', shape: 'icon' },
  'Lightspeed': { agent: 'Waylay', ability: 'Lightspeed', shape: 'icon' },

  // Yoru
  'Fakeout': { agent: 'Yoru', ability: 'Fakeout', shape: 'icon' },
  'Blindside': { agent: 'Yoru', ability: 'Blindside', shape: 'icon' },
  'Gatecrash': { agent: 'Yoru', ability: 'Gatecrash', shape: 'icon' },
  'Dimensional Drift': { agent: 'Yoru', ability: 'Dimensional Drift', shape: 'icon' },
};

export const getAbilityDefinition = (name: string): AbilityDefinition | undefined => {
  // Direct match
  if (ABILITY_DEFINITIONS[name]) return ABILITY_DEFINITIONS[name];

  // Case-insensitive/Partial match fallback
  const normalizedMatch = Object.keys(ABILITY_DEFINITIONS).find(key =>
    key.toLowerCase() === name.toLowerCase() ||
    name.toLowerCase().includes(key.toLowerCase()) ||
    key.toLowerCase().includes(name.toLowerCase())
  );

  return normalizedMatch ? ABILITY_DEFINITIONS[normalizedMatch] : undefined;
};

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
