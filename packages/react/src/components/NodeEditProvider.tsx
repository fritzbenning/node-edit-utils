import type { NodeProviderRef } from "@node-edit-utils/core";
import { forwardRef } from "react";
import { useNodeToolSet } from "@/hooks/useNodeToolSet";

interface NodeEditProviderProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  isVisible?: boolean;
}

export const NodeEditProvider = forwardRef<NodeProviderRef, NodeEditProviderProps>(({ children, isVisible = false, ...props }, ref) => {
  useNodeToolSet(ref as React.RefObject<NodeProviderRef>);

  return (
    <div ref={ref} data-role="node-provider" style={{ opacity: isVisible ? "1" : "0", transition: "opacity 0.3s ease-in-out" }} {...props}>
      {children}
    </div>
  );
});
