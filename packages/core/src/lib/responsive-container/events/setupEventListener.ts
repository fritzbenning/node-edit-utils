export const setupEventListener = (
  resizeHandle: HTMLElement,
  startResize: (event: MouseEvent) => void,
  handleResize: (event: MouseEvent) => void,
  stopResize: (event: MouseEvent) => void
): (() => void) => {
  resizeHandle.addEventListener("mousedown", startResize);
  document.addEventListener("mousemove", handleResize);
  document.addEventListener("mouseup", stopResize);

  return () => {
    resizeHandle.removeEventListener("mousedown", startResize);
    document.removeEventListener("mousemove", handleResize);
    document.removeEventListener("mouseup", stopResize);
  };
};
