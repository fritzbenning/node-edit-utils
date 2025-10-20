import { createHighlightFrame } from "./createHighlightFrame";
import { getElementBounds } from "./helpers/getElementBounds";
import { getHighlightFrameElement } from "./helpers/getHighlightFrameElement";
import { connectResizeObserver } from "./observer/connectResizeObserver";
import { updateHighlightFrame } from "./updateHighlightFrame";

let resizeObserver: (() => void) | null = null;
let raf: number | null = null;

export const highlightNode = (node: HTMLElement | null, nodeProvider: HTMLElement): (() => void) | undefined => {
  if (!node) return;

  const existingHighlightFrame = getHighlightFrameElement(nodeProvider);
  if (existingHighlightFrame) {
    existingHighlightFrame.remove();
  }

  const highlightFrame = createHighlightFrame(node, nodeProvider);

  nodeProvider.appendChild(highlightFrame);

  resizeObserver = connectResizeObserver(nodeProvider, () => {
    if (raf) cancelAnimationFrame(raf);
    raf = requestAnimationFrame(() => {
      updateHighlightFrame(node, nodeProvider);
    });
  });

  return () => {
    if (raf) cancelAnimationFrame(raf);
    resizeObserver?.();
  };
};
