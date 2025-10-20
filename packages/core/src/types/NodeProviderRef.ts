import type { NodeToolSet } from "./NodeToolSet";

export interface NodeProviderRef extends HTMLDivElement {
  toolSet?: NodeToolSet;
}
