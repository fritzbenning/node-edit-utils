import { EDITOR_PRESET } from "@markup-canvas/core";
import { MarkupCanvas } from "@markup-canvas/react";
import type { NodeToolsRef } from "@node-edit-utils/core";
import { useRef } from "react";
import { useCanvasStartPosition } from "../hooks/useCanvasStartPosition";
import { NodeToolsProvider } from "./NodeToolsProvider";
import { ResponsiveContainer } from "./ResponsiveContainer";

export function CanvasProvider({ children, width, height }: { children: React.ReactNode; width: number; height: number }) {
  const nodeToolsRef = useRef<NodeToolsRef>(null);

  const { x, y, isReady } = useCanvasStartPosition(nodeToolsRef);

  return (
    <MarkupCanvas {...EDITOR_PRESET} width={width} height={height} name="canvas" initialPan={{ x, y }}>
      <ResponsiveContainer>
        <NodeToolsProvider ref={nodeToolsRef} isVisible={isReady}>
          {children}
        </NodeToolsProvider>
      </ResponsiveContainer>
    </MarkupCanvas>
  );
}
