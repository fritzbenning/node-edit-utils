import { getCanvasContainer } from "@/lib/canvas/helpers/getCanvasContainer";
import { getCanvasWindowValue } from "@/lib/canvas/helpers/getCanvasWindowValue";
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
  const viewportWidth = document.documentElement.clientWidth || window.innerWidth;
  const viewportHeight = document.documentElement.clientHeight || window.innerHeight;
  frame.setAttribute("width", viewportWidth.toString());
  frame.setAttribute("height", viewportHeight.toString());

  // Update instance class
  if (isInstance) {
    frame.classList.add("is-instance");
  } else {
    frame.classList.remove("is-instance");
  }

  // Update text edit class
  if (isTextEdit) {
    frame.classList.add("is-text-edit");
  } else {
    frame.classList.remove("is-text-edit");
  }

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

  const canvasContainer = getCanvasContainer();
  const container = canvasContainer || document.body;
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
  if (toolsWrapper) {
    if (isInstance) {
      toolsWrapper.classList.add("is-instance");
    } else {
      toolsWrapper.classList.remove("is-instance");
    }
    // Update text edit class
    if (isTextEdit) {
      toolsWrapper.classList.add("is-text-edit");
    } else {
      toolsWrapper.classList.remove("is-text-edit");
    }
  }
  if (nodeTools) {
    if (isInstance) {
      nodeTools.classList.add("is-instance");
    } else {
      nodeTools.classList.remove("is-instance");
    }
    // Update text edit class
    if (isTextEdit) {
      nodeTools.classList.add("is-text-edit");
    } else {
      nodeTools.classList.remove("is-text-edit");
    }
  }

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
