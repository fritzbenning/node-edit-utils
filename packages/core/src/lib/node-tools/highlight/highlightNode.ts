import { getCanvasContainer } from "@/lib/canvas/helpers/getCanvasContainer";
import { isComponentInstance } from "../select/helpers/isComponentInstance";
import { createHighlightFrame } from "./createHighlightFrame";
import { createToolsContainer } from "./createToolsContainer";
import { getHighlightFrameElement } from "./helpers/getHighlightFrameElement";
import { getScreenBounds } from "./helpers/getScreenBounds";

export const highlightNode = (node: HTMLElement | null): void => {
  if (!node) return;

  const existingHighlightFrame = getHighlightFrameElement();
  const canvasContainer = getCanvasContainer();
  const existingToolsWrapper =
    canvasContainer?.querySelector(".highlight-frame-tools-wrapper") || document.body.querySelector(".highlight-frame-tools-wrapper");

  if (existingHighlightFrame) {
    existingHighlightFrame.remove();
  }
  if (existingToolsWrapper) {
    existingToolsWrapper.remove();
  }

  const isInstance = isComponentInstance(node);
  const highlightFrame = createHighlightFrame(node, isInstance);

  if (node.contentEditable === "true") {
    highlightFrame.classList.add("is-editable");
  }

  // Batch DOM reads
  const { left, top, height } = getScreenBounds(node);
  const bottomY = top + height;

  // Create tools wrapper using CSS transform (GPU-accelerated)
  const toolsWrapper = document.createElement("div");
  toolsWrapper.classList.add("highlight-frame-tools-wrapper");
  if (isInstance) {
    toolsWrapper.classList.add("is-instance");
  }
  toolsWrapper.style.position = "absolute";
  toolsWrapper.style.transform = `translate(${left}px, ${bottomY}px)`;
  toolsWrapper.style.transformOrigin = "left center";
  toolsWrapper.style.pointerEvents = "none";
  toolsWrapper.style.zIndex = "500";

  createToolsContainer(node, toolsWrapper, isInstance);
  if (canvasContainer) {
    canvasContainer.appendChild(toolsWrapper);
  } else {
    document.body.appendChild(toolsWrapper);
  }
};
