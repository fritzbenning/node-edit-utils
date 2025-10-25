import { createHighlightFrame } from "./createHighlightFrame";
import { createNodeTools } from "./createNodeTools";
import { getHighlightFrameElement } from "./helpers/getHighlightFrameElement";
import { connectResizeObserver } from "./observer/connectResizeObserver";
import { refreshHighlightFrame } from "./refreshHighlightFrame";

export const highlightNode = (node: HTMLElement | null, nodeProvider: HTMLElement): (() => void) | undefined => {
  if (!node) return;

  const existingHighlightFrame = getHighlightFrameElement(nodeProvider);
  if (existingHighlightFrame) {
    existingHighlightFrame.remove();
  }

  const highlightFrame = createHighlightFrame(node, nodeProvider);

  // Add class if node is editable
  if (node.contentEditable === "true") {
    highlightFrame.classList.add("is-editable");
  }

  createNodeTools(node, highlightFrame);

  nodeProvider.appendChild(highlightFrame);

  let resizeObserver: (() => void) | null = null;
  let raf: number | null = null;

  resizeObserver = connectResizeObserver(nodeProvider, () => {
    if (raf) cancelAnimationFrame(raf);
    raf = requestAnimationFrame(() => {
      refreshHighlightFrame(node, nodeProvider, window.canvas?.zoom.current ?? 1);
    });
  });

  return () => {
    if (raf) cancelAnimationFrame(raf);
    resizeObserver?.();
  };
};
