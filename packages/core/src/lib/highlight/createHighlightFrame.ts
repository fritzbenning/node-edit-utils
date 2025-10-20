import { getElementBounds } from "./helpers/getElementBounds";

export const createHighlightFrame = (node: HTMLElement, nodeProvider: HTMLElement): HTMLElement => {
  const { top, left, width, height } = getElementBounds(node, nodeProvider);
  
  nodeProvider.style.setProperty("--zoom", window.canvas?.zoom.current?.toString() ?? "1");

  const frame = document.createElement("div");
  frame.classList.add("highlight-frame");

  frame.style.position = "absolute";
  frame.style.top = `${top}px`;
  frame.style.left = `${left}px`;
  frame.style.width = `${width}px`;
  frame.style.height = `${height}px`;
  frame.style.zIndex = "1000";
  frame.style.pointerEvents = "none";
  
  frame.style.border = "calc(2px / var(--zoom)) solid oklch(62.7% 0.265 303.9)";

  const highlightFrame = frame

  return highlightFrame;
};