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
  svg.style.zIndex = "5000";

  const viewportWidth = document.documentElement.clientWidth || window.innerWidth;
  const viewportHeight = document.documentElement.clientHeight || window.innerHeight;
  svg.setAttribute("width", viewportWidth.toString());
  svg.setAttribute("height", viewportHeight.toString());

  const group = document.createElementNS("http://www.w3.org/2000/svg", "g");
  group.classList.add("highlight-frame-group");
  group.setAttribute("transform", `translate(${left}, ${top})`);

  const rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
  rect.setAttribute("x", "0");
  rect.setAttribute("y", "0");
  rect.setAttribute("width", width.toString());
  rect.setAttribute("height", height.toString());
  rect.setAttribute("vector-effect", "non-scaling-stroke");
  rect.classList.add("highlight-frame-rect");

  group.appendChild(rect);

  createCornerHandles(group, width, height);

  svg.appendChild(group);
  document.body.appendChild(svg);

  return svg as SVGSVGElement;
};
