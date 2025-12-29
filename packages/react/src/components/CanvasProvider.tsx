import { EDITOR_PRESET } from "@markup-canvas/core";
import { MarkupCanvas } from "@markup-canvas/react";
import { useCanvasObserver } from "@/hooks/useCanvasObserver";
import { useCanvasPanPosition } from "../hooks/useCanvasPanPosition";
import { NodeTools } from "./NodeTools";

export function CanvasProvider({
  children,
  width,
  height,
  themeMode,
  canvasName = "canvas",
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
        {children}
      </NodeTools>
    </MarkupCanvas>
  );
}
