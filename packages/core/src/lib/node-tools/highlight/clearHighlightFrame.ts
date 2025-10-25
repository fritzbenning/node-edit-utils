import { getHighlightFrameElement } from "./helpers/getHighlightFrameElement";

export const clearHighlightFrame = (nodeProvider: HTMLElement): void => {
  const highlightFrame = getHighlightFrameElement(nodeProvider);
  if (highlightFrame) {
    highlightFrame.remove();
  }
};
