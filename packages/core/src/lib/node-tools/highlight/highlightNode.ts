import { isComponentInstance } from "../select/helpers/isComponentInstance";
import { createHighlightFrame } from "./createHighlightFrame";
import { createToolsContainer } from "./createToolsContainer";
import { getHighlightFrameElement } from "./helpers/getHighlightFrameElement";
import { getScreenBounds } from "./helpers/getScreenBounds";

export const highlightNode = (node: HTMLElement | null): void => {
  if (!node) return;

  const existingHighlightFrame = getHighlightFrameElement();
  const existingToolsWrapper = document.body.querySelector(".highlight-frame-tools-wrapper");

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
  toolsWrapper.style.position = "fixed";
  toolsWrapper.style.transform = `translate(${left}px, ${bottomY}px)`;
  toolsWrapper.style.transformOrigin = "left center";
  toolsWrapper.style.pointerEvents = "none";
  toolsWrapper.style.zIndex = "5000"; // Match --z-index-highlight (below canvas rulers)

  createToolsContainer(node, toolsWrapper, isInstance);
  document.body.appendChild(toolsWrapper);
};
