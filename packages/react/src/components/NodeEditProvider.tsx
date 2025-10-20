import { useNodeToolSet } from "@/hooks/useNodeToolSet";
import { useRef } from "react";

export function NodeEditProvider({ children }: { children: React.ReactNode }) {
  const nodeEditRef = useRef<HTMLDivElement>(null);
  const toolSet = useNodeToolSet(nodeEditRef);

  return <div ref={nodeEditRef}>{children}</div>;
}