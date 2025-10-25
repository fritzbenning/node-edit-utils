import { NodeTools, type NodeToolsRef } from "@node-edit-utils/core";
import { type RefObject, useEffect, useState } from "react";

export const useNodeTools = (ref: RefObject<NodeToolsRef | null>): NodeTools | null => {
  const [nodeTools, setNodeTools] = useState<NodeTools | null>(null);

  useEffect(() => {
    if (!ref.current) {
      return;
    }

    const newNodeTools = new NodeTools(ref.current);
    setNodeTools(newNodeTools);

    return () => {
      newNodeTools?.cleanup();
    };
  }, [ref]);

  return nodeTools;
};
