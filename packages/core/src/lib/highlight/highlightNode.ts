import { createHighlightFrame } from "./createHighlightFrame";
import { getElementBounds } from "./helpers/getElementBounds";

export const highlightNode = (node: HTMLElement | null, nodeProvider: HTMLElement): void => {
  if (!node) return;

  const existingHighlightFrame = nodeProvider.querySelector(".highlight-frame");
  if (existingHighlightFrame) {
    existingHighlightFrame.remove();
  }

  const { top, left, width, height } = getElementBounds(node, nodeProvider);

  const highlightFrame = createHighlightFrame(top, left, width, height);

  nodeProvider.appendChild(highlightFrame);
};
