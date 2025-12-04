import { getCanvasContainer } from "@/lib/canvas/helpers/getCanvasContainer";

export function getHighlightFrameElement(): SVGSVGElement | null {
  const canvasContainer = getCanvasContainer();
  const container = canvasContainer || document.body;
  return container.querySelector(".highlight-frame-overlay") as SVGSVGElement | null;
}
