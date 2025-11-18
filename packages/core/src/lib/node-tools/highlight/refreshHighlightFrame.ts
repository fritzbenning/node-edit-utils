import { getCanvasWindowValue } from "@/lib/canvas/helpers/getCanvasWindowValue";
import { getHighlightFrameElement } from "./helpers/getHighlightFrameElement";
import { getScreenBounds } from "./helpers/getScreenBounds";

export const refreshHighlightFrame = (node: HTMLElement, nodeProvider: HTMLElement) => {
  const HANDLE_SIZE = 6;

  // Check if frame exists first before doing any expensive operations
  const frame = getHighlightFrameElement();
  if (!frame) return;

  const rect = frame.querySelector("rect");
  if (!rect) return;

  const zoom = getCanvasWindowValue(["zoom", "current"]) ?? 1;
  const bounds = getScreenBounds(node);

  const { top, left, width, height } = bounds;

  const handleXOffset = HANDLE_SIZE / 2;
  const topLeftX = left - handleXOffset;
  const topLeftY = top - handleXOffset;
  const topRightX = left + width - handleXOffset;
  const topRightY = top - handleXOffset;
  const bottomRightX = left + width - handleXOffset;
  const bottomRightY = top + height - handleXOffset;
  const bottomLeftX = left - handleXOffset;
  const bottomLeftY = top + height - handleXOffset;

  // Batch all DOM writes (single paint pass)
  // Update rect
  rect.setAttribute("x", left.toString());
  rect.setAttribute("y", top.toString());
  rect.setAttribute("width", width.toString());
  rect.setAttribute("height", height.toString());

  // Update corner handles positions
  const topLeft = frame.querySelector(".handle-top-left");
  const topRight = frame.querySelector(".handle-top-right");
  const bottomRight = frame.querySelector(".handle-bottom-right");
  const bottomLeft = frame.querySelector(".handle-bottom-left");

  if (topLeft) {
    topLeft.setAttribute("x", topLeftX.toString());
    topLeft.setAttribute("y", topLeftY.toString());
  }
  if (topRight) {
    topRight.setAttribute("x", topRightX.toString());
    topRight.setAttribute("y", topRightY.toString());
  }
  if (bottomRight) {
    bottomRight.setAttribute("x", bottomRightX.toString());
    bottomRight.setAttribute("y", bottomRightY.toString());
  }
  if (bottomLeft) {
    bottomLeft.setAttribute("x", bottomLeftX.toString());
    bottomLeft.setAttribute("y", bottomLeftY.toString());
  }

  // Update tools wrapper using CSS transform (GPU-accelerated)
  const toolsWrapper = document.body.querySelector(".highlight-frame-tools-wrapper") as HTMLElement | null;
  if (toolsWrapper) {
    const centerX = left + width / 2;
    const bottomY = top + height;
    toolsWrapper.style.transform = `translate(${centerX}px, ${bottomY}px) translateX(-50%)`;
  }

  // Update tool opacity
  if (zoom <= 10) {
    nodeProvider.style.setProperty("--tool-opacity", `1`);
  } else {
    nodeProvider.style.setProperty("--tool-opacity", `0`);
  }
};
