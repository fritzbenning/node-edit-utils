import type { NodeProviderRef } from "@node-edit-utils/core";
import { useRef } from "react";
import { useNodeToolSet } from "@/hooks/useNodeToolSet";

export function NodeEditProvider({ children }: { children: React.ReactNode }) {
  const nodeProviderRef = useRef<NodeProviderRef>(null);

  useNodeToolSet(nodeProviderRef);

  return (
    <div ref={nodeProviderRef} data-role="node-provider">
      {children}
    </div>
  );
}
