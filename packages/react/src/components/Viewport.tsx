import type { ViewportRef } from "@node-edit-utils/core";
import { forwardRef, useImperativeHandle, useRef } from "react";
import { useViewport } from "@/hooks/useViewport";

interface ViewportProps {
  children: React.ReactNode;
  width?: number;
  x?: number;
  y?: number;
  name?: string;
  exported?: boolean;
}

export const Viewport = forwardRef<ViewportRef, ViewportProps>(({ children, width, x = 0, y = 0, name, exported }, forwardedRef) => {
  const ref = useRef<ViewportRef>(null);
  useViewport(ref, width);

  useImperativeHandle(forwardedRef, () => ref.current as ViewportRef, []);

  return (
    <div
      ref={ref}
      className="viewport @container/viewport"
      style={{ colorScheme: "light", transform: `translate3d(${x}px, ${y}px, 0)` }}
      data-viewport-name={name || undefined}
      data-exported={exported || undefined}
    >
      {children}
    </div>
  );
});
