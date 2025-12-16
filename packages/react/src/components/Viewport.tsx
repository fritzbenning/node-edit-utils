import type { ViewportRef } from "@node-edit-utils/core";
import { forwardRef } from "react";
import { useViewport } from "@/hooks/useViewport";

interface ViewportProps {
  children: React.ReactNode;
  width?: number;
  x?: number;
  y?: number;
  name?: string;
}

export const Viewport = forwardRef<ViewportRef, ViewportProps>(({ children, width, x = 0, y = 0, name }, ref) => {
  useViewport(ref as React.RefObject<ViewportRef>, width);

  return (
    <div
      ref={ref}
      className="viewport @container/viewport"
      style={{ colorScheme: "light", transform: `translate3d(${x}px, ${y}px, 0)` }}
      data-viewport-name={name || undefined}
    >
      {children}
    </div>
  );
});
