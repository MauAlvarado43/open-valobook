export interface IconConfig {
  outline: string;
  isSolid?: boolean;
  detail?: string;
}

export const LUCIDE_PATHS: Record<string, IconConfig> = {
  flag: {
    outline: "M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z M4 22v-7",
    isSolid: true
  },
  danger: {
    outline: "M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z",
    detail: "M12 9v4 M12 17h.01",
    isSolid: true
  },
  warning: {
    outline: "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z",
    detail: "M12 8v4 M12 16h.01",
    isSolid: true
  }
};
