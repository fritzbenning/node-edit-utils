export const enableCanvasKeyboard = () => {
  // biome-ignore lint/suspicious/noExplicitAny: canvas config extension
  (window.canvas as any)?.keyboard?.enable();
};
