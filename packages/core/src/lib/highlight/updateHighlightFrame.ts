import { getElementBounds } from "./helpers/getElementBounds";
import { getHighlightFrameElement } from "./helpers/getHighlightFrameElement";

export const updateHighlightFrame = (node: HTMLElement, nodeProvider: HTMLElement) => {
  const frame = getHighlightFrameElement(nodeProvider);

  if (!frame) return;
  
  const { top, left, width, height } = getElementBounds(node, nodeProvider);

  frame.style.setProperty("--frame-top", `${top}px`);
  frame.style.setProperty("--frame-left", `${left}px`);
  frame.style.setProperty("--frame-width", `${width}px`);
  frame.style.setProperty("--frame-height", `${height}px`);
};