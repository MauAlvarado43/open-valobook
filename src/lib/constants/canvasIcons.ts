export interface IconConfig {
  outline: string;
  isSolid?: boolean;
  detail?: string;
}

export const LUCIDE_PATHS: Record<string, IconConfig> = {
  flag: {
    outline: 'M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z M4 22v-7',
    isSolid: true,
  },
  danger: {
    outline: 'm21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z',
    detail: 'M12 9v4 M12 17h.01',
    isSolid: true,
  },
  warning: {
    outline: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z',
    detail: 'M12 8v4 M12 16h.01',
    isSolid: true,
  },
};
