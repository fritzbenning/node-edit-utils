import { getCanvasWindowValue } from "@/lib/canvas/helpers/getCanvasWindowValue";
import { getHighlightFrameElement } from "./helpers/getHighlightFrameElement";
import { getScreenBounds } from "./helpers/getScreenBounds";

export const refreshHighlightFrame = (node: HTMLElement, nodeProvider: HTMLElement) => {
  const HANDLE_SIZE = 6;

  // Batch all DOM reads first (single layout pass)
  const frame = getHighlightFrameElement();
  if (!frame) return;

  const rect = frame.querySelector("rect");
  if (!rect) return;

  // Batch all queries together
  const topLeft = frame.querySelector(".handle-top-left");
  const topRight = frame.querySelector(".handle-top-right");
  const bottomRight = frame.querySelector(".handle-bottom-right");
  const bottomLeft = frame.querySelector(".handle-bottom-left");
  const toolsWrapper = document.body.querySelector(".highlight-frame-tools-wrapper") as HTMLElement | null;

  const zoom = getCanvasWindowValue(["zoom", "current"]) ?? 1;
  const bounds = getScreenBounds(node);

  // Calculate all values before any DOM writes
  const { top, left, width, height } = bounds;
  const bottomY = top + height;

  // Batch all DOM writes (single paint pass)
  // Update rect
  rect.setAttribute("x", left.toString());
  rect.setAttribute("y", top.toString());
  rect.setAttribute("width", width.toString());
  rect.setAttribute("height", height.toString());

  // Update corner handles positions
  if (topLeft) {
    topLeft.setAttribute("x", (left - HANDLE_SIZE / 2).toString());
    topLeft.setAttribute("y", (top - HANDLE_SIZE / 2).toString());
  }
  if (topRight) {
    topRight.setAttribute("x", (left + width - HANDLE_SIZE / 2).toString());
    topRight.setAttribute("y", (top - HANDLE_SIZE / 2).toString());
  }
  if (bottomRight) {
    bottomRight.setAttribute("x", (left + width - HANDLE_SIZE / 2).toString());
    bottomRight.setAttribute("y", (top + height - HANDLE_SIZE / 2).toString());
  }
  if (bottomLeft) {
    bottomLeft.setAttribute("x", (left - HANDLE_SIZE / 2).toString());
    bottomLeft.setAttribute("y", (top + height - HANDLE_SIZE / 2).toString());
  }

  // Update tools wrapper position (use calculated bounds, not rect attributes)
  if (toolsWrapper) {
    toolsWrapper.style.left = `${left}px`;
    toolsWrapper.style.top = `${bottomY}px`;
  }

  if (zoom <= 10) {
    nodeProvider.style.setProperty("--tool-opacity", `1`);
  } else {
    nodeProvider.style.setProperty("--tool-opacity", `0`);
  }
};
