export const DEFAULT_WIDTH = 400;

export const RESIZE_CONFIG = {
  minWidth: 4,
  maxWidth: 2560,
} as const;

export const RESIZE_PRESETS = [
  {
    name: "Mobile",
    rawValue: 390,
    value: "320px",
  },
  {
    name: "Tablet Portrait",
    rawValue: 768,
    value: "768px",
  },
  {
    name: "Tablet Landscape",
    rawValue: 1024,
    value: "1024px",
  },
  {
    name: "Notebook",
    rawValue: 1280,
    value: "1280px",
  },
  {
    name: "Desktop",
    rawValue: 1680,
    value: "1680px",
  },
] as const;
