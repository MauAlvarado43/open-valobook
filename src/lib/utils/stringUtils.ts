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
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
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
