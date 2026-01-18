/**
 * Signature colors for each agent based on their visual identity and abilities.
 */
export const AGENT_COLORS: Record<string, string> = {
  'astra': '#7C3AED',
  'breach': '#B45309',
  'brimstone': '#FB923C',
  'clove': '#EC4899',
  'cypher': '#754b48',
  'deadlock': '#FFFFFF',
  'fade': '#1E293B',
  'gekko': '#84CC16',
  'harbor': '#387c9c',
  'iso': '#8B5CF6',
  'jett': '#94A3B8',
  'kay/o': '#6366F1',
  'killjoy': '#EAB308',
  'neon': '#22D3EE',
  'omen': '#5F4B8B',
  'phoenix': '#F87171',
  'raze': '#EA580C',
  'reyna': '#A21CAF',
  'sage': '#2DD4BF',
  'skye': '#10B981',
  'sova': '#3B82F6',
  'tejo': '#ba8e47',
  'veto': '#64748B',
  'viper': '#22C55E',
  'vyse': '#6D28D9',
  'waylay': '#8ac451',
  'yoru': '#1D4ED8',
};

export const getAgentColor = (name: string): string => {
  const normalized = name.toLowerCase().trim();
  return AGENT_COLORS[normalized] || '#FFFFFF';
};
