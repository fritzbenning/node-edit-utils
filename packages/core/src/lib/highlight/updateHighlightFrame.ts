import { getElementBounds } from "./helpers/getElementBounds";
import { getHighlightFrameElement } from "./helpers/getHighlightFrameElement";

export const updateHighlightFrame = (node: HTMLElement, nodeProvider: HTMLElement) => {
  const frame = getHighlightFrameElement(nodeProvider);

  if (!frame) return;
  
  const { top, left, width, height } = getElementBounds(node, nodeProvider);

  frame.style.top = `${top}px`;
  frame.style.left = `${left}px`;
  frame.style.width = `${width}px`;
  frame.style.height = `${height}px`;
};