export type AbilityShape = 'smoke' | 'wall' | 'curved-wall' | 'rect' | 'area' | 'path' | 'icon' | 'guided-path';

export interface StatValue {
  value?: number | object;
  min?: number;
  max?: number;
  unit: string | null;
}

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
  stats?: Record<string, StatValue>;
}

export const METERS_TO_PX = 7.5;

/**
 * Gets a scaled dimension (radius, width, height) for an ability.
 * Prioritizes quantified stats over hardcoded defaults.
 */
export function getAbilityDimension(
  def: AbilityDefinition,
  type: 'radius' | 'innerRadius' | 'width' | 'height' | 'maxDistance'
): number | undefined {
  if (def.stats) {
    const stats = def.stats;

    // Helper to find a value by partial key match
    const findVal = (keys: string[]) => {
      for (const k of keys) {
        if (stats[k]) {
          const stat = stats[k];
          // Prefer 'value', but use 'max' if value doesn't exist
          const val = stat.value !== undefined ? stat.value : stat.max;
          if (val !== undefined) return (val as number) * METERS_TO_PX;
        }
      }
      // Try fuzzy match for keys containing the word
      for (const [k, v] of Object.entries(stats)) {
        if (keys.some(search => k.toLowerCase().includes(search.toLowerCase()))) {
          const val = v.value !== undefined ? v.value : v.max;
          if (val !== undefined) return (val as number) * METERS_TO_PX;
        }
      }
      return undefined;
    };

    if (type === 'radius') {
      const val = findVal(['radius', 'diameter', 'size']);
      if (val !== undefined && stats.diameter) return val / 2;
      if (val !== undefined) return val;
    }

    if (type === 'innerRadius') {
      return findVal(['innerRadius', 'inner radius', 'detection radius']);
    }

    if (type === 'width') {
      return findVal(['width', 'length', 'wall dimensions', 'distance']);
    }

    if (type === 'height') {
      return findVal(['height', 'thickness']);
    }

    if (type === 'maxDistance') {
      return findVal(['maxDistance', 'distance', 'range', 'max range']);
    }
  }

  // Fallback to defaults
  if (type === 'radius') return def.defaultRadius;
  if (type === 'width') return def.defaultWidth;
  if (type === 'height') return def.defaultHeight;
  if (type === 'maxDistance') return def.maxDistance;

  return undefined;
}

/**
 * Gets a safe maximum limit for resizing an ability dimension.
 * Returns the exact wiki stat (1:1 ratio).
 */
export function getMaxDimension(
  def: AbilityDefinition | undefined,
  type: 'radius' | 'width' | 'height' | 'maxDistance'
): number {
  if (def) {
    const baseVal = getAbilityDimension(def, type);
    if (baseVal) return baseVal; // 1:1 with wiki stat
  }

  // Generic defaults if no stat is available
  if (type === 'radius') return 150;
  if (type === 'width') return 300;
  if (type === 'height') return 150;
  if (type === 'maxDistance') return 500;

  return 200;
}

/**
 * Gets the minimum allowed dimension for an ability.
 * Returns the min value from stats, or a reasonable default.
 */
export function getMinDimension(
  def: AbilityDefinition | undefined,
  type: 'radius' | 'width' | 'height'
): number {
  if (!def?.stats) return 10; // Default minimum

  const stats = def.stats;
  let stat: any;

  // Find the relevant stat
  if (type === 'radius' && stats.radius) {
    stat = stats.radius;
  } else if (type === 'width' && stats.width) {
    stat = stats.width;
  } else if (type === 'height' && stats.height) {
    stat = stats.height;
  }

  // Return min if it exists, scaled to pixels
  if (stat && 'min' in stat && stat.min !== undefined) {
    return (stat.min as number) * METERS_TO_PX;
  }

  // Default minimums
  if (type === 'radius') return 10;
  if (type === 'width') return 20;
  if (type === 'height') return 5;

  return 10;
}

/**
 * Checks if an ability has a fixed size (min === max).
 * If true, resizing should be disabled.
 */
export function isFixedSize(
  def: AbilityDefinition | undefined,
  type: 'radius' | 'width' | 'height'
): boolean {
  if (!def?.stats) return false;

  const stats = def.stats;
  let stat: any;

  // Find the relevant stat
  if (type === 'radius' && stats.radius) {
    stat = stats.radius;
  } else if (type === 'width' && stats.width) {
    stat = stats.width;
  } else if (type === 'height' && stats.height) {
    stat = stats.height;
  }

  // Check if min and max exist and are equal
  if (stat && 'min' in stat && 'max' in stat) {
    return stat.min === stat.max;
  }

  return false;
}
