import { getHighlightFrameElement } from "./helpers/getHighlightFrameElement";

export const updateHighlightFrameVisibility = (node: HTMLElement, nodeProvider: HTMLElement): void => {
  const frame = getHighlightFrameElement(nodeProvider);
  if (!frame) return;

  const className = node.className;
  const hasHiddenClass = /\bhidden\b/.test(className) || node.classList.contains("select-none");
  frame.style.display = hasHiddenClass ? "none" : "";
};
