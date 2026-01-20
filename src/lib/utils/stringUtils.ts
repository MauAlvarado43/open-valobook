/**
 * Normalizes a string to Title Case.
 * Example: "COSMIC DIVIDE" -> "Cosmic Divide"
 * Example: "gravity well" -> "Gravity Well"
 */
export function toTitleCase(str: string): string {
  if (!str) return '';

  return str
    .toLowerCase()
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

/**
 * Normalizes an ability name specifically for Valorant, handling special cases if needed.
 */
export function normalizeAbilityName(name: string): string {
  if (!name) return '';

  // Custom mapping for tricky names or abbreviations
  const customMapping: Record<string, string> = {
    'ASTRAL FORM / COSMIC DIVIDE': 'Cosmic Divide',
  };

  const upperName = name.toUpperCase();
  if (customMapping[upperName]) return customMapping[upperName];

  return toTitleCase(name);
}
/**
 * Slugifies an ability name for use as a key.
 * Example: "Gravity Well" -> "gravity_well"
 * Example: "Nebula  / Dissipate" -> "nebula_dissipate"
 */
export function slugifyAbilityName(name: string): string {
  if (!name) return '';
  return name
    .toLowerCase()
    .replace(/\//g, '') // remove /
    .replace(/\s+/g, '_') // replace spaces with _
    .replace(/[^a-z0-9_]/g, '') // remove other special chars
    .replace(/_+/g, '_') // ensure no double underscores
    .replace(/^_|_$/g, ''); // remove leading/trailing underscores
}
