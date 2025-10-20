import { type NodeProviderRef, NodeToolSet } from "@node-edit-utils/core";
import { type RefObject, useEffect, useState } from "react";

export const useNodeToolSet = (ref: RefObject<NodeProviderRef | null>): NodeToolSet | null => {
  const [toolSet, setToolSet] = useState<NodeToolSet | null>(null);

  useEffect(() => {
    console.log("useNodeToolSet effect running, ref.current:", ref.current);

    if (!ref.current) {
      console.log("ref.current is null or undefined, returning early");
      return;
    }

    console.log("Creating new NodeToolSet instance");
    const newToolSet = new NodeToolSet(ref.current);
    setToolSet(newToolSet);

    console.log(window.nodeEditUtils.getSelectedNode());

    return () => {
      console.log("Cleaning up NodeToolSet");
      newToolSet.cleanup();
    };
  }, [ref]);

  return toolSet;
};
