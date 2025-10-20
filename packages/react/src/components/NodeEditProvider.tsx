import { useNodeToolSet } from "@/hooks/useNodeToolSet";
import { useRef } from "react";
import { NodeProviderRef } from "@node-edit-utils/core";

export function NodeEditProvider({ children }: { children: React.ReactNode }) {    
  const nodeProviderRef = useRef<NodeProviderRef>(null);

  useNodeToolSet(nodeProviderRef);

  return <div ref={nodeProviderRef} data-role="node-provider">{children}</div>;
}