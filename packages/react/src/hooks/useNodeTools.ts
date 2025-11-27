import { createNodeTools, type NodeTools } from "@node-edit-utils/core";
import { type RefObject, useEffect, useState } from "react";

export const useNodeTools = (ref: RefObject<HTMLElement | null>, canvasName: string = "canvas"): NodeTools | null => {
  const [nodeTools, setNodeTools] = useState<NodeTools | null>(null);

  useEffect(() => {
    if (!ref.current) {
      return;
    }

    const tools = createNodeTools(ref.current, canvasName);
    setNodeTools(tools);

    return () => {
      tools?.cleanup();
    };
  }, [ref, canvasName]);

  return nodeTools;
};
