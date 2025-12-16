import { EDITOR_PRESET } from "@markup-canvas/core";
import { MarkupCanvas } from "@markup-canvas/react";
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
  useCanvasObserver(canvasName);
  const { x, y, isReady } = useCanvasPanPosition();

  return (
    <MarkupCanvas {...EDITOR_PRESET} width={width} height={height} initialPan={{ x, y }} themeMode={themeMode} name={canvasName}>
      <NodeTools isVisible={isReady} canvasName={canvasName}>
        <Viewport width={viewportWidth} name="ProductCard">
          {children}
        </Viewport>
        <Viewport width={viewportWidth} x={1200} y={0} name="TestContent" exported>
          Viewport 2
        </Viewport>
      </NodeTools>
    </MarkupCanvas>
  );
}
