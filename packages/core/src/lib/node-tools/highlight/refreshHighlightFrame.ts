import { getCanvasContainerOrBody } from "@/lib/canvas/helpers/getCanvasContainerOrBody";
import { getCanvasWindowValue } from "@/lib/canvas/helpers/getCanvasWindowValue";
import { getViewportDimensions } from "@/lib/helpers/getViewportDimensions";
import { toggleClass } from "@/lib/helpers/toggleClass";
import { isComponentInstance } from "../select/helpers/isComponentInstance";
import { getHighlightFrameElement } from "./helpers/getHighlightFrameElement";
import { getScreenBounds } from "./helpers/getScreenBounds";

const getComponentColor = (): string => {
  return getComputedStyle(document.documentElement).getPropertyValue("--component-color").trim() || "oklch(65.6% 0.241 354.308)";
};

const getTextEditColor = (): string => {
  return getComputedStyle(document.documentElement).getPropertyValue("--text-edit-color").trim() || "oklch(62.3% 0.214 259.815)";
};

export const refreshHighlightFrame = (node: HTMLElement, nodeProvider: HTMLElement, canvasName: string = "canvas") => {
  // Batch all DOM reads first (single layout pass)
  const frame = getHighlightFrameElement();
  if (!frame) return;

  const isInstance = isComponentInstance(node);
  const isTextEdit = node.contentEditable === "true";

  // Update SVG dimensions to match current viewport (handles window resize and ensures coordinate system is correct)
  // Use clientWidth/Height to match getBoundingClientRect() coordinate system (excludes scrollbars)
  const { width: viewportWidth, height: viewportHeight } = getViewportDimensions();
  frame.setAttribute("width", viewportWidth.toString());
  frame.setAttribute("height", viewportHeight.toString());

  // Update instance class
  toggleClass(frame, "is-instance", isInstance);

  // Update text edit class
  toggleClass(frame, "is-text-edit", isTextEdit);

  const group = frame.querySelector(".highlight-frame-group") as SVGGElement | null;
  if (!group) return;

  const rect = group.querySelector("rect");
  if (!rect) return;

  // Update instance color
  if (isInstance) {
    rect.setAttribute("stroke", getComponentColor());
  } else if (isTextEdit) {
    rect.setAttribute("stroke", getTextEditColor());
  } else {
    rect.removeAttribute("stroke"); // Use CSS default
  }

  const container = getCanvasContainerOrBody();
  const toolsWrapper = container.querySelector(".highlight-frame-tools-wrapper") as HTMLElement | null;
  const nodeTools = toolsWrapper?.querySelector(".node-tools") as HTMLElement | null;

  const zoom = getCanvasWindowValue(["zoom", "current"], canvasName) ?? 1;
  const bounds = getScreenBounds(node);

  // Calculate all values before any DOM writes
  const { top, left, width, height } = bounds;
  // Ensure minimum width of 2px
  const minWidth = Math.max(width, 3);
  const bottomY = top + height;

  // Update instance classes on tools wrapper and node tools
  toggleClass(toolsWrapper, "is-instance", isInstance);
  toggleClass(toolsWrapper, "is-text-edit", isTextEdit);
  toggleClass(nodeTools, "is-instance", isInstance);
  toggleClass(nodeTools, "is-text-edit", isTextEdit);

  // Batch all DOM writes (single paint pass)
  // Update group transform to move entire group (rect + handles) at once
  group.setAttribute("transform", `translate(${left}, ${top})`);

  // Update rect dimensions (position is handled by group transform)
  rect.setAttribute("width", minWidth.toString());
  rect.setAttribute("height", height.toString());

  // Update corner handles positions (relative to group, so only width/height matter)
  const topLeft = group.querySelector(".handle-top-left");
  const topRight = group.querySelector(".handle-top-right");
  const bottomRight = group.querySelector(".handle-bottom-right");
  const bottomLeft = group.querySelector(".handle-bottom-left");

  const HANDLE_SIZE = 6;

  // Update handle colors and positions
  const handles = [topLeft, topRight, bottomRight, bottomLeft];
  handles.forEach((handle) => {
    if (handle) {
      if (isInstance) {
        handle.setAttribute("stroke", getComponentColor());
      } else if (isTextEdit) {
        handle.setAttribute("stroke", getTextEditColor());
      } else {
        handle.removeAttribute("stroke"); // Use CSS default
      }
    }
  });

  if (topLeft) {
    topLeft.setAttribute("x", (-HANDLE_SIZE / 2).toString());
    topLeft.setAttribute("y", (-HANDLE_SIZE / 2).toString());
  }
  if (topRight) {
    topRight.setAttribute("x", (minWidth - HANDLE_SIZE / 2).toString());
    topRight.setAttribute("y", (-HANDLE_SIZE / 2).toString());
  }
  if (bottomRight) {
    bottomRight.setAttribute("x", (minWidth - HANDLE_SIZE / 2).toString());
    bottomRight.setAttribute("y", (height - HANDLE_SIZE / 2).toString());
  }
  if (bottomLeft) {
    bottomLeft.setAttribute("x", (-HANDLE_SIZE / 2).toString());
    bottomLeft.setAttribute("y", (height - HANDLE_SIZE / 2).toString());
  }

  // Update tools wrapper position using CSS transform (GPU-accelerated)
  if (toolsWrapper) {
    toolsWrapper.style.transform = `translate(${left}px, ${bottomY}px)`;
  }

  // Update tool opacity
  if (zoom <= 10) {
    nodeProvider.style.setProperty("--tool-opacity", `1`);
  } else {
    nodeProvider.style.setProperty("--tool-opacity", `0`);
  }
};
