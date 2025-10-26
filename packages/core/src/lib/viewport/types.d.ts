export interface Viewport {
  setWidth: (width: number) => void;
  cleanup: () => void;
}

export interface ViewportRef extends HTMLDivElement {
  viewport?: Viewport;
}
