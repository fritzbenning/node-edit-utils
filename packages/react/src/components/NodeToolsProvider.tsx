import type { NodeToolsRef } from "@node-edit-utils/core";
import { forwardRef } from "react";
import { useNodeTools } from "@/hooks/useNodeTools";

interface NodeEditProviderProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  isVisible?: boolean;
}

export const NodeToolsProvider = forwardRef<NodeToolsRef, NodeEditProviderProps>(({ children, isVisible = false, ...props }, ref) => {
  useNodeTools(ref as React.RefObject<NodeToolsRef>);

  return (
    <div
      ref={ref}
      data-role="node-provider"
      className="node-provider"
      style={{ opacity: isVisible ? "1" : "0", transition: "opacity 0.3s ease-in-out" }}
      {...props}
    >
      {children}
    </div>
  );
});
