export const createResizeHandle = (container: HTMLElement): HTMLElement => {
  const handle = document.createElement("div");

  handle.className = "component-resize-handle resize-handle";

  container.appendChild(handle);

  return handle;
};
