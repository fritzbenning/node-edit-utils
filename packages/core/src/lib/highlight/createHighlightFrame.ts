import { getElementBounds } from "./helpers/getElementBounds";

export const createHighlightFrame = (node: HTMLElement, nodeProvider: HTMLElement): HTMLElement => {
  const { top, left, width, height } = getElementBounds(node, nodeProvider);
  
  nodeProvider.style.setProperty("--zoom", window.canvas?.zoom.current?.toString() ?? "1");

  const frame = document.createElement("div");
  frame.classList.add("highlight-frame");
    
  frame.style.setProperty("--frame-top", `${top}px`);
  frame.style.setProperty("--frame-left", `${left}px`);
  frame.style.setProperty("--frame-width", `${width}px`);
  frame.style.setProperty("--frame-height", `${height}px`);

  frame.style.position = "absolute";
  frame.style.top = `var(--frame-top)`;
  frame.style.left = `var(--frame-left)`;
  frame.style.width = `var(--frame-width)`;
  frame.style.height = `var(--frame-height)`;
  frame.style.zIndex = "1000";
  frame.style.pointerEvents = "none";
  
  frame.style.border = "calc(2px / var(--zoom)) solid oklch(62.7% 0.265 303.9)";

  const highlightFrame = frame

  return highlightFrame;
};