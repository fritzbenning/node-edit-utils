import type { NodeTools } from "../node-tools/types";

export const getNodeTools = (): NodeTools | undefined => {
  return (window as Window & { nodeTools?: NodeTools }).nodeTools;
};

