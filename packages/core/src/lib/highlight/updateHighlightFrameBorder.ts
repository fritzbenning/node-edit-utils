import { getElementBounds } from "./helpers/getElementBounds";
import { getHighlightFrameElement } from "./helpers/getHighlightFrameElement";

export const updateHighlightFrameBorder = (node: HTMLElement, nodeProvider: HTMLElement, zoom: number) => {
  const frame = getHighlightFrameElement(nodeProvider);

  if (!frame) return;

  nodeProvider.style.setProperty("--zoom", zoom.toString());
  
  const { top, left, width, height } = getElementBounds(node, nodeProvider);

  frame.style.setProperty("--frame-top", `${top}px`);
  frame.style.setProperty("--frame-left", `${left}px`);
  frame.style.setProperty("--frame-width", `${width}px`);
  frame.style.setProperty("--frame-height", `${height}px`);
};