import { getElementBounds } from "./helpers/getElementBounds";
import { getHighlightFrameElement } from "./helpers/getHighlightFrameElement";

export const updateHighlightFrame = (node: HTMLElement, nodeProvider: HTMLElement, zoom: number) => {
  const frame = getHighlightFrameElement(nodeProvider);

  if (!frame) return;

  nodeProvider.style.setProperty("--zoom", zoom.toFixed(5));
  nodeProvider.style.setProperty("--stroke-width", (2 / zoom).toFixed(3));

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
};
