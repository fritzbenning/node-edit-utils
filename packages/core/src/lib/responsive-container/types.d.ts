export interface ResponsiveContainer {
  setWidth: (width: number) => void;
  cleanup: () => void;
}

export interface ResponsiveContainerRef extends HTMLDivElement {
  responsiveContainer?: ResponsiveContainer;
}
