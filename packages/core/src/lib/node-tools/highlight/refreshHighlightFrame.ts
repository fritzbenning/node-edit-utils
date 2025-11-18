import { getCanvasWindowValue } from "@/lib/canvas/helpers/getCanvasWindowValue";
import { getHighlightFrameElement } from "./helpers/getHighlightFrameElement";
import { getScreenBounds } from "./helpers/getScreenBounds";

export const refreshHighlightFrame = (node: HTMLElement, nodeProvider: HTMLElement) => {
  const frame = getHighlightFrameElement();
  const zoom = getCanvasWindowValue(["zoom", "current"]) ?? 1;

  console.log("1. refreshHighlightFrame", node);

  if (!frame) return;

  const { top, left, width, height } = getScreenBounds(node);

  const HANDLE_SIZE = 6;

  const rect = frame.querySelector("rect");
  if (rect) {
    rect.setAttribute("x", left.toString());
    rect.setAttribute("y", top.toString());
    rect.setAttribute("width", width.toString());
    rect.setAttribute("height", height.toString());
  }

  // Update corner handles positions
  const topLeft = frame.querySelector(".handle-top-left");
  const topRight = frame.querySelector(".handle-top-right");
  const bottomRight = frame.querySelector(".handle-bottom-right");
  const bottomLeft = frame.querySelector(".handle-bottom-left");

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

  const toolsWrapper = document.body.querySelector(".highlight-frame-tools-wrapper") as HTMLElement | null;

  if (toolsWrapper && rect) {
    const rectX = parseFloat(rect.getAttribute("x") || "0");
    const rectWidth = parseFloat(rect.getAttribute("width") || "0");
    const rectY = parseFloat(rect.getAttribute("y") || "0");
    const rectHeight = parseFloat(rect.getAttribute("height") || "0");

    const centerX = rectX + rectWidth / 2;
    const bottomY = rectY + rectHeight;

    toolsWrapper.style.left = `${rectX}px`;
    toolsWrapper.style.top = `${bottomY}px`;
  }

  if (zoom <= 10) {
    nodeProvider.style.setProperty("--tool-opacity", `1`);
  } else {
    nodeProvider.style.setProperty("--tool-opacity", `0`);
  }

  console.log("2. refreshHighlightFrame", top, left, width, height);
};
