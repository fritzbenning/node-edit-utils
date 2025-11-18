import { createCornerHandles } from "./createCornerHandles";
import { getScreenBounds } from "./helpers/getScreenBounds";

export const createHighlightFrame = (node: HTMLElement): SVGSVGElement => {
  const { top, left, width, height } = getScreenBounds(node);

  // Create fixed SVG overlay
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.classList.add("highlight-frame-overlay");
  svg.setAttribute("data-node-id", node.getAttribute("data-node-id") || "");

  // Set fixed positioning
  svg.style.position = "fixed";
  svg.style.top = "0";
  svg.style.left = "0";
  svg.style.width = "100vw";
  svg.style.height = "100vh";
  svg.style.pointerEvents = "none";
  svg.style.zIndex = "10000"; // Match your --z-index-high

  const rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
  rect.setAttribute("x", left.toString());
  rect.setAttribute("y", top.toString());
  rect.setAttribute("width", width.toString());
  rect.setAttribute("height", height.toString());
  rect.setAttribute("vector-effect", "non-scaling-stroke");
  rect.classList.add("highlight-frame-rect");

  svg.appendChild(rect);

  createCornerHandles(svg, top, left, width, height);

  document.body.appendChild(svg);

  return svg as SVGSVGElement;
};
