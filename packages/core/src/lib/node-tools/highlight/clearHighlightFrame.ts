export const clearHighlightFrame = (): void => {
  const frame = document.body.querySelector(".highlight-frame-overlay");
  if (frame) {
    frame.remove();
  }

  const toolsWrapper = document.body.querySelector(".highlight-frame-tools-wrapper");
  if (toolsWrapper) {
    toolsWrapper.remove();
  }
};
