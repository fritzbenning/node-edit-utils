import { getCanvasContainer } from "@/lib/canvas/helpers/getCanvasContainer";

export const clearHighlightFrame = (): void => {
  const canvasContainer = getCanvasContainer();
  const container = canvasContainer || document.body;
  
  const frame = container.querySelector(".highlight-frame-overlay");
  if (frame) {
    frame.remove();
  }

  const toolsWrapper = container.querySelector(".highlight-frame-tools-wrapper");
  if (toolsWrapper) {
    toolsWrapper.remove();
  }
};
