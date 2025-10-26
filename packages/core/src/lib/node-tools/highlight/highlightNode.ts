import { createHighlightFrame } from "./createHighlightFrame";
import { createNodeTools } from "./createNodeTools";
import { getHighlightFrameElement } from "./helpers/getHighlightFrameElement";

export const highlightNode = (node: HTMLElement | null, nodeProvider: HTMLElement) => {
  if (!node) return;

  const existingHighlightFrame = getHighlightFrameElement(nodeProvider);
  if (existingHighlightFrame) {
    existingHighlightFrame.remove();
  }

  const highlightFrame = createHighlightFrame(node, nodeProvider);

  // Add class if node is editable
  if (node.contentEditable === "true") {
    highlightFrame.classList.add("is-editable");
  }

  createNodeTools(node, highlightFrame);

  nodeProvider.appendChild(highlightFrame);
};
