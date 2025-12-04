import { getCanvasContainer } from "@/lib/canvas/helpers/getCanvasContainer";
import { getHighlightFrameElement } from "./helpers/getHighlightFrameElement";

export const updateHighlightFrameVisibility = (node: HTMLElement): void => {
  const frame = getHighlightFrameElement();
  if (!frame) return;

  // Batch DOM reads
  const hasHiddenClass = node.classList.contains("hidden") || node.classList.contains("select-none");
  const displayValue = hasHiddenClass ? "none" : "";

  // Batch DOM writes
  frame.style.display = displayValue;

  const canvasContainer = getCanvasContainer();
  const container = canvasContainer || document.body;
  const toolsWrapper = container.querySelector(".highlight-frame-tools-wrapper") as HTMLElement | null;
  if (toolsWrapper) {
    toolsWrapper.style.display = displayValue;
  }
};
