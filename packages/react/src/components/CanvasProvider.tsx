import { EDITOR_PRESET } from "@markup-canvas/core";
import { MarkupCanvas } from "@markup-canvas/react";
import type { NodeToolsRef } from "@node-edit-utils/core";
import { useRef } from "react";
import { useCanvasObserver } from "@/hooks/useCanvasObserver";
import { useCanvasStartPosition } from "../hooks/useCanvasStartPosition";
import { NodeTools } from "./NodeTools";
import { Viewport } from "./Viewport";

export function CanvasProvider({ children, width, height }: { children: React.ReactNode; width: number; height: number }) {
  useCanvasObserver();

  const nodeToolsRef = useRef<NodeToolsRef>(null);
  const { x, y, isReady } = useCanvasStartPosition(nodeToolsRef);

  return (
    <MarkupCanvas {...EDITOR_PRESET} width={width} height={height} initialPan={{ x, y }}>
      <Viewport>
        <NodeTools ref={nodeToolsRef} isVisible={isReady}>
          {children}
        </NodeTools>
      </Viewport>
    </MarkupCanvas>
  );
}
