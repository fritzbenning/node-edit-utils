import { createNodeTools, type NodeTools } from "@node-edit-utils/core";
import { type RefObject, useEffect, useState } from "react";

export const useNodeTools = (ref: RefObject<HTMLElement | null>, canvasName: string = "canvas"): NodeTools | null => {
  const [nodeTools, setNodeTools] = useState<NodeTools | null>(null);

  useEffect(() => {
    console.log("ref.current", ref.current);
  }, [ref]);

  useEffect(() => {
    console.log("ref.current", ref.current);
    if (ref?.current === null) {
      return;
    }

    const tools = createNodeTools(ref.current, canvasName);
    setNodeTools(tools);

    return () => {
      tools?.cleanup();
    };
  }, [ref.current, canvasName]);

  return nodeTools;
};
