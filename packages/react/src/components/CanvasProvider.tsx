import { EDITOR_PRESET } from "@markup-canvas/core";
import { MarkupCanvas } from "@markup-canvas/react";
import type { ViewportRef } from "@node-edit-utils/core";
import { useRef } from "react";
import { useCanvasObserver } from "@/hooks/useCanvasObserver";
import { useCanvasPanPosition } from "../hooks/useCanvasPanPosition";
import { NodeTools } from "./NodeTools";
import { Viewport } from "./Viewport";

export function CanvasProvider({
  children,
  width,
  height,
  themeMode,
  canvasName = "canvas",
  viewportWidth,
}: {
  children: React.ReactNode;
  width: number;
  height: number;
  themeMode: "light" | "dark";
  canvasName?: string;
  viewportWidth?: number;
}) {
  const viewportRef = useRef<ViewportRef>(null);

  useCanvasObserver(canvasName);
  const { x, y, isReady } = useCanvasPanPosition(viewportRef);

  return (
    <MarkupCanvas {...EDITOR_PRESET} width={width} height={height} initialPan={{ x, y }} themeMode={themeMode} name={canvasName}>
      <NodeTools isVisible={isReady} canvasName={canvasName}>
        <Viewport width={viewportWidth} ref={viewportRef} name="ProductCard">
          {children}
        </Viewport>
        <Viewport width={viewportWidth} x={1200} y={0} name="TestContent">
          Viewport 2
        </Viewport>
      </NodeTools>
    </MarkupCanvas>
  );
}
