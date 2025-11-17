import { getHighlightFrameElement } from "./helpers/getHighlightFrameElement";

export const updateHighlightFrameVisibility = (node: HTMLElement, nodeProvider: HTMLElement): void => {
  const frame = getHighlightFrameElement(nodeProvider);
  if (!frame) return;

  const hasHiddenClass = node.classList.contains("hidden") || node.classList.contains("select-none");
  const displayValue = hasHiddenClass ? "none" : "";

  frame.style.display = displayValue;

  const tagLabel = frame.querySelector(".tag-label") as HTMLElement | null;
  if (tagLabel) {
    tagLabel.style.display = displayValue;
  }
};
