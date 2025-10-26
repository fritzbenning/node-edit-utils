import type { ResponsiveContainer } from "@/lib/responsive-container/ResponsiveContainer";

export interface ResponsiveContainerRef extends HTMLDivElement {
  responsiveContainer?: ResponsiveContainer;
}
