import type { ViewportRef } from "@node-edit-utils/core";
import { useRef } from "react";
import { useViewport } from "@/hooks/useViewport";

export const Viewport = ({ children, viewportWidth }: { children: React.ReactNode; viewportWidth?: number }) => {
  const viewportRef = useRef<ViewportRef>(null);

  useViewport(viewportRef, viewportWidth);

  return (
    <div ref={viewportRef} className="viewport @container/viewport" style={{ colorScheme: "light" }}>
      {children}
    </div>
  );
};
