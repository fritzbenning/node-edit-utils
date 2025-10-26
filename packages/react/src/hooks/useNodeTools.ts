import { createNodeTools, type NodeTools } from "@node-edit-utils/core";
import { type RefObject, useEffect, useState } from "react";

export const useNodeTools = (ref: RefObject<HTMLElement | null>): NodeTools | null => {
  const [nodeTools, setNodeTools] = useState<NodeTools | null>(null);

  useEffect(() => {
    if (!ref.current) {
      return;
    }

    const tools = createNodeTools(ref.current);
    setNodeTools(tools);

    return () => {
      tools?.cleanup();
    };
  }, [ref]);

  return nodeTools;
};
