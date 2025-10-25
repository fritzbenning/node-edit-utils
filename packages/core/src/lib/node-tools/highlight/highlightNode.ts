import { createHighlightFrame } from "./createHighlightFrame";
import { createNodeTools } from "./createNodeTools";
import { getHighlightFrameElement } from "./helpers/getHighlightFrameElement";
import { connectResizeObserver } from "./observer/connectResizeObserver";
import { updateHighlightFrame } from "./updateHighlightFrame";

export const highlightNode = (node: HTMLElement | null, nodeProvider: HTMLElement): (() => void) | undefined => {
  if (!node) return;

  const existingHighlightFrame = getHighlightFrameElement(nodeProvider);
  if (existingHighlightFrame) {
    existingHighlightFrame.remove();
  }

  const highlightFrame = createHighlightFrame(node, nodeProvider);

  createNodeTools(node, highlightFrame);

  nodeProvider.appendChild(highlightFrame);

  let resizeObserver: (() => void) | null = null;
  let raf: number | null = null;

  resizeObserver = connectResizeObserver(nodeProvider, () => {
    if (raf) cancelAnimationFrame(raf);
    raf = requestAnimationFrame(() => {
      updateHighlightFrame(node, nodeProvider, window.canvas?.zoom.current ?? 1);
    });
  });

  return () => {
    if (raf) cancelAnimationFrame(raf);
    resizeObserver?.();
  };
};
