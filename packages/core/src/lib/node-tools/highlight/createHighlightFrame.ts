import { getCanvasContainerOrBody } from "@/lib/canvas/helpers/getCanvasContainerOrBody";
import { getViewportDimensions } from "@/lib/helpers/getViewportDimensions";
import { createCornerHandles } from "./createCornerHandles";
import { getScreenBounds } from "./helpers/getScreenBounds";

const getComponentColor = (): string => {
  return getComputedStyle(document.documentElement).getPropertyValue("--component-color").trim() || "oklch(65.6% 0.241 354.308)";
};

const getTextEditColor = (): string => {
  return getComputedStyle(document.documentElement).getPropertyValue("--text-edit-color").trim() || "oklch(62.3% 0.214 259.815)";
};

export const createHighlightFrame = (node: HTMLElement, isInstance: boolean = false, isTextEdit: boolean = false): SVGSVGElement => {
  const { top, left, width, height } = getScreenBounds(node);

  // Ensure minimum width of 2px
  const minWidth = Math.max(width, 3);

  // Create fixed SVG overlay
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.classList.add("highlight-frame-overlay");
  if (isInstance) {
    svg.classList.add("is-instance");
  }
  if (isTextEdit) {
    svg.classList.add("is-text-edit");
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

  const { width: viewportWidth, height: viewportHeight } = getViewportDimensions();
  svg.setAttribute("width", viewportWidth.toString());
  svg.setAttribute("height", viewportHeight.toString());

  const group = document.createElementNS("http://www.w3.org/2000/svg", "g");
  group.classList.add("highlight-frame-group");
  group.setAttribute("transform", `translate(${left}, ${top})`);

  const rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
  rect.setAttribute("x", "0");
  rect.setAttribute("y", "0");
  rect.setAttribute("width", minWidth.toString());
  rect.setAttribute("height", height.toString());
  rect.setAttribute("vector-effect", "non-scaling-stroke");
  rect.classList.add("highlight-frame-rect");

  // Apply instance color if it's an instance, otherwise text edit color if in text edit mode
  if (isInstance) {
    rect.setAttribute("stroke", getComponentColor());
  } else if (isTextEdit) {
    rect.setAttribute("stroke", getTextEditColor());
  }

  group.appendChild(rect);

  createCornerHandles(group, minWidth, height, isInstance, isTextEdit);

  svg.appendChild(group);
  const container = getCanvasContainerOrBody();
  container.appendChild(svg);

  return svg as SVGSVGElement;
};
