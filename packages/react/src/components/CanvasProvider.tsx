import { EDITOR_PRESET } from "@markup-canvas/core";
import { MarkupCanvas } from "@markup-canvas/react";
import type { NodeProviderRef } from "@node-edit-utils/core";
import { useRef } from "react";
import { useCanvasStartPosition } from "../hooks/useCanvasStartPosition";
import { NodeEditProvider } from "./NodeEditProvider";
import { ResponsiveHandler } from "./ResponsiveHandler";

export function CanvasProvider({ children, width, height }: { children: React.ReactNode; width: number; height: number }) {
  const nodeEditRef = useRef<NodeProviderRef>(null);

  const { x, y, isReady } = useCanvasStartPosition(nodeEditRef);

  return (
    <MarkupCanvas {...EDITOR_PRESET} width={width} height={height} name="canvas" initialPan={{ x, y }}>
      <ResponsiveHandler>
        <NodeEditProvider ref={nodeEditRef} isVisible={isReady}>
          {children}
        </NodeEditProvider>
      </ResponsiveHandler>
    </MarkupCanvas>
  );
}
