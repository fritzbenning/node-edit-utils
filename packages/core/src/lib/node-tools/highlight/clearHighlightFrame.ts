import { getHighlightFrameElement } from "./helpers/getHighlightFrameElement";

export const clearHighlightFrame = (nodeProvider: HTMLElement | null): void => {
  if (!nodeProvider) {
    return;
  }

  const highlightFrame = getHighlightFrameElement(nodeProvider);
  if (highlightFrame) {
    highlightFrame.remove();
  }
};
