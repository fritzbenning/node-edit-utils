import { getHighlightFrameElement } from "./helpers/getHighlightFrameElement";

export const updateHighlightFrameVisibility = (node: HTMLElement): void => {
  const frame = getHighlightFrameElement();
  if (!frame) return;

  // Batch DOM reads
  const hasHiddenClass = node.classList.contains("hidden") || node.classList.contains("select-none");
  const displayValue = hasHiddenClass ? "none" : "";

  // Batch DOM writes
  frame.style.display = displayValue;

  const toolsWrapper = document.body.querySelector(".highlight-frame-tools-wrapper") as HTMLElement | null;
  if (toolsWrapper) {
    toolsWrapper.style.display = displayValue;
  }
};
