import { getCanvasContainerOrBody } from "@/lib/canvas/helpers/getCanvasContainerOrBody";

export const clearHighlightFrame = (): void => {
  const container = getCanvasContainerOrBody();
  
  const frame = container.querySelector(".highlight-frame-overlay");
  if (frame) {
    frame.remove();
  }

  const toolsWrapper = container.querySelector(".highlight-frame-tools-wrapper");
  if (toolsWrapper) {
    toolsWrapper.remove();
  }
};
