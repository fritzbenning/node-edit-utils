import { getCanvasContainerOrBody } from "@/lib/canvas/helpers/getCanvasContainerOrBody";

export function getHighlightFrameElement(): SVGSVGElement | null {
  const container = getCanvasContainerOrBody();
  return container.querySelector(".highlight-frame-overlay") as SVGSVGElement | null;
}
