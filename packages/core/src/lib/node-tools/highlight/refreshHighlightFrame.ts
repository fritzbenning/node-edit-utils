import { getCanvasWindowValue } from "@/lib/canvas/helpers/getCanvasWindowValue";
import { getElementBounds } from "./helpers/getElementBounds";
import { getHighlightFrameElement } from "./helpers/getHighlightFrameElement";

export const refreshHighlightFrame = (node: HTMLElement, nodeProvider: HTMLElement) => {
  const frame = getHighlightFrameElement(nodeProvider);
  const zoom = getCanvasWindowValue(["zoom", "current"]) ?? 1;

  console.log("1. refreshHighlightFrame", node);

  if (!frame) return;

  if (zoom >= 0.3) {
    nodeProvider.style.setProperty("--tool-opacity", `1`);
  } else {
    nodeProvider.style.setProperty("--tool-opacity", `0`);
  }

  const { top, left, width, height } = getElementBounds(node, nodeProvider);

  frame.style.setProperty("--frame-top", `${top}px`);
  frame.style.setProperty("--frame-left", `${left}px`);
  frame.style.setProperty("--frame-width", `${width}px`);
  frame.style.setProperty("--frame-height", `${height}px`);

  console.log("2. refreshHighlightFrame", top, left, width, height);
};
