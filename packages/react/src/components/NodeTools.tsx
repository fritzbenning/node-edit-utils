import type { NodeToolsRef } from "@node-edit-utils/core";
import { useRef } from "react";
import { useNodeTools } from "@/hooks/useNodeTools";

interface NodeEditProviderProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  isVisible?: boolean;
  canvasName?: string;
}

export const NodeTools = ({ children, isVisible = false, canvasName, ...props }: NodeEditProviderProps) => {
  const ref = useRef<NodeToolsRef>(null);

  useNodeTools(ref, canvasName);

  return (
    <div ref={ref} data-role="node-provider" className="node-provider" style={{ opacity: isVisible ? 1 : 0 }} {...props}>
      {children}
    </div>
  );
};
