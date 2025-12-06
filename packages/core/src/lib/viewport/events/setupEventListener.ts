export const setupEventListener = (
  resizeHandle: HTMLElement,
  startResize: (event: MouseEvent) => void,
  handleResize: (event: MouseEvent) => void,
  stopResize: (event: MouseEvent) => void,
  blurResize: () => void
): (() => void) => {
  const handleMouseLeave = (event: MouseEvent): void => {
    // Check if mouse is leaving the window/document
    if (!event.relatedTarget && (event.target === document || event.target === document.documentElement)) {
      blurResize();
    }
  };

  resizeHandle.addEventListener("mousedown", startResize);
  document.addEventListener("mousemove", handleResize);
  document.addEventListener("mouseup", stopResize);
  document.addEventListener("mouseleave", handleMouseLeave);

  window.addEventListener("blur", blurResize);

  return () => {
    resizeHandle.removeEventListener("mousedown", startResize);
    document.removeEventListener("mousemove", handleResize);
    document.removeEventListener("mouseup", stopResize);
    document.removeEventListener("mouseleave", handleMouseLeave);
    window.removeEventListener("blur", blurResize);
  };
};
