export const APP_CONFIG = {
  SUPPORTED_LANGUAGES: ['en', 'es'] as const,
  DEFAULT_LANGUAGE: 'en' as const,
  VERSION: '1.0.1',
  STORAGE_KEYS: {
    SETTINGS: 'openvalobook-settings',
  },
};

export type Language = (typeof APP_CONFIG.SUPPORTED_LANGUAGES)[number];
