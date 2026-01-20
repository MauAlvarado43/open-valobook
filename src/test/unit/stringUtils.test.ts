import { describe, it, expect } from 'vitest';
import { toTitleCase, normalizeAbilityName } from '../../lib/utils/stringUtils';

describe('String Utils', () => {
  it('toTitleCase should format strings', () => {
    expect(toTitleCase('HELLO WORLD')).toBe('Hello World');
  });

  it('normalizeAbilityName should handle custom mappings', () => {
    expect(normalizeAbilityName('ASTRAL FORM / COSMIC DIVIDE')).toBe('Cosmic Divide');
  });
});
