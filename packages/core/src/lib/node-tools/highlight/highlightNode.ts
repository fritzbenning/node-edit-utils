import { createHighlightFrame } from "./createHighlightFrame";
import { createToolsContainer } from "./createToolsContainer";
import { getHighlightFrameElement } from "./helpers/getHighlightFrameElement";

export const highlightNode = (node: HTMLElement | null, nodeProvider: HTMLElement): void => {
  if (!node) return;

  const existingHighlightFrame = getHighlightFrameElement(nodeProvider);

  if (existingHighlightFrame) {
    existingHighlightFrame.remove();
  }

  const highlightFrame = createHighlightFrame(node, nodeProvider);

  if (node.contentEditable === "true") {
    highlightFrame.classList.add("is-editable");
  }

  createToolsContainer(node, highlightFrame);

  nodeProvider.appendChild(highlightFrame);
};
