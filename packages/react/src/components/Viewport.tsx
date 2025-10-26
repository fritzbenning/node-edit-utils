import type { ViewportRef } from "@node-edit-utils/core";
import { useRef } from "react";
import { useViewport } from "@/hooks/useViewport";

export const Viewport = ({ children }: { children: React.ReactNode }) => {
  const viewportRef = useRef<ViewportRef>(null);

  const viewport = useViewport(viewportRef);

  return (
    <div ref={viewportRef} className="viewport">
      {children}
    </div>
  );
};
