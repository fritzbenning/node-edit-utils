export const disableCanvasKeyboard = () => {
  // biome-ignore lint/suspicious/noExplicitAny: canvas config extension
  (window.canvas as any)?.keyboard?.disable();
};
