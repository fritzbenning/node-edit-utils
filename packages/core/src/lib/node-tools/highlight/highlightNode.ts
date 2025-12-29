import { getCanvasContainerOrBody } from "@/lib/canvas/helpers/getCanvasContainerOrBody";
import { toggleClass } from "@/lib/helpers/toggleClass";
import { isComponentInstance } from "../select/helpers/isComponentInstance";
import { createHighlightFrame } from "./createHighlightFrame";
import { createToolsContainer } from "./createToolsContainer";
import { getHighlightFrameElement } from "./helpers/getHighlightFrameElement";
import { getScreenBounds } from "./helpers/getScreenBounds";

export const highlightNode = (node: HTMLElement | null): void => {
  if (!node) return;

  const existingHighlightFrame = getHighlightFrameElement();
  const container = getCanvasContainerOrBody();
  const existingToolsWrapper = container.querySelector(".highlight-frame-tools-wrapper");

  if (existingHighlightFrame) {
    existingHighlightFrame.remove();
  }
  if (existingToolsWrapper) {
    existingToolsWrapper.remove();
  }

  const isInstance = isComponentInstance(node);
  const isTextEdit = node.contentEditable === "true";
  const highlightFrame = createHighlightFrame(node, isInstance, isTextEdit);

  if (node.contentEditable === "true") {
    highlightFrame.classList.add("is-editable");
  }

  // Batch DOM reads
  const { left, top, height } = getScreenBounds(node);
  const bottomY = top + height;

  // Create tools wrapper using CSS transform (GPU-accelerated)
  const toolsWrapper = document.createElement("div");
  toolsWrapper.classList.add("highlight-frame-tools-wrapper");
  toggleClass(toolsWrapper, "is-instance", isInstance);
  toggleClass(toolsWrapper, "is-text-edit", isTextEdit);
  toolsWrapper.style.position = "absolute";
  toolsWrapper.style.transform = `translate(${left}px, ${bottomY}px)`;
  toolsWrapper.style.transformOrigin = "left center";
  toolsWrapper.style.pointerEvents = "none";
  toolsWrapper.style.zIndex = "500";

  createToolsContainer(node, toolsWrapper, isInstance, isTextEdit);
  container.appendChild(toolsWrapper);
};
