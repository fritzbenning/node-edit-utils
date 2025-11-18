import { getHighlightFrameCache } from "./helpers/getHighlightFrameCache";

export const updateHighlightFrameVisibility = (node: HTMLElement): void => {
  const { frame, toolsWrapper } = getHighlightFrameCache();
  if (!frame) return;

  // Batch DOM reads
  const hasHiddenClass = node.classList.contains("hidden") || node.classList.contains("select-none");
  const displayValue = hasHiddenClass ? "none" : "";

  // Batch DOM writes
  frame.style.display = displayValue;
  if (toolsWrapper) {
    toolsWrapper.style.display = displayValue;
  }
};
