import { getCanvasContainer } from "@/lib/canvas/helpers/getCanvasContainer";
import { createCornerHandles } from "./createCornerHandles";
import { getScreenBounds } from "./helpers/getScreenBounds";

const getComponentColor = (): string => {
  return getComputedStyle(document.documentElement).getPropertyValue("--component-color").trim() || "oklch(65.6% 0.241 354.308)";
};

export const createHighlightFrame = (node: HTMLElement, isInstance: boolean = false): SVGSVGElement => {
  const { top, left, width, height } = getScreenBounds(node);

  // Create fixed SVG overlay
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.classList.add("highlight-frame-overlay");
  if (isInstance) {
    svg.classList.add("is-instance");
  }
  svg.setAttribute("data-node-id", node.getAttribute("data-node-id") || "");

  // Set fixed positioning
  svg.style.position = "absolute";
  svg.style.top = "0";
  svg.style.left = "0";
  svg.style.width = "100vw";
  svg.style.height = "100vh";
  svg.style.pointerEvents = "none";
  svg.style.zIndex = "500";

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

  // Apply instance color if it's an instance
  if (isInstance) {
    rect.setAttribute("stroke", getComponentColor());
  }

  group.appendChild(rect);

  createCornerHandles(group, width, height, isInstance);

  svg.appendChild(group);
  const canvasContainer = getCanvasContainer();
  if (canvasContainer) {
    canvasContainer.appendChild(svg);
  } else {
    document.body.appendChild(svg);
  }

  return svg as SVGSVGElement;
};
