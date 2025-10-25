import { getElementBounds } from "./helpers/getElementBounds";

export const createHighlightFrame = (node: HTMLElement, nodeProvider: HTMLElement): HTMLElement => {
  const { top, left, width, height } = getElementBounds(node, nodeProvider);

  const zoom = window.canvas?.zoom.current ?? 1;

  document.body.style.setProperty("--zoom", zoom.toString());
  document.body.style.setProperty("--stroke-width", (2 / zoom).toFixed(3));

  const frame = document.createElement("div");
  frame.classList.add("highlight-frame");

  frame.style.setProperty("--frame-top", `${top}px`);
  frame.style.setProperty("--frame-left", `${left}px`);
  frame.style.setProperty("--frame-width", `${width}px`);
  frame.style.setProperty("--frame-height", `${height}px`);

  // Create SVG overlay for outline
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.classList.add("highlight-frame-svg");
  const rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
  rect.setAttribute("x", "0");
  rect.setAttribute("y", "0");
  rect.setAttribute("width", "100%");
  rect.setAttribute("height", "100%");
  rect.classList.add("highlight-frame-rect");

  svg.appendChild(rect);
  frame.appendChild(svg);

  const highlightFrame = frame;

  return highlightFrame;
};
