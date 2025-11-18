import { createHighlightFrame } from "./createHighlightFrame";
import { createToolsContainer } from "./createToolsContainer";
import { clearHighlightFrameCache, setHighlightFrameCache, setToolsWrapperCache } from "./helpers/getHighlightFrameCache";
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

  // Clear cache when removing elements
  clearHighlightFrameCache();

  const highlightFrame = createHighlightFrame(node);
  setHighlightFrameCache(highlightFrame);

  if (node.contentEditable === "true") {
    highlightFrame.classList.add("is-editable");
  }

  // Batch DOM reads
  const { left, top, width, height } = getScreenBounds(node);
  const centerX = left + width / 2;
  const bottomY = top + height;

  // Create tools wrapper using CSS transform (GPU-accelerated)
  const toolsWrapper = document.createElement("div");
  toolsWrapper.classList.add("highlight-frame-tools-wrapper");
  toolsWrapper.style.position = "fixed";
  toolsWrapper.style.transform = `translate(${centerX}px, ${bottomY}px) translateX(-50%)`;
  toolsWrapper.style.transformOrigin = "center";
  toolsWrapper.style.pointerEvents = "none";
  toolsWrapper.style.zIndex = "10000";

  setToolsWrapperCache(toolsWrapper);
  createToolsContainer(node, toolsWrapper);
  document.body.appendChild(toolsWrapper);
};
