import type { NodeTools } from "@/lib/node-tools/createNodeTools";

export interface NodeToolsRef extends HTMLDivElement {
  nodeTools?: NodeTools;
}
