const HANDLE_SIZE = 6;

const getComponentColor = (): string => {
  return getComputedStyle(document.documentElement).getPropertyValue("--component-color").trim() || "oklch(65.6% 0.241 354.308)";
};

const getTextEditColor = (): string => {
  return getComputedStyle(document.documentElement).getPropertyValue("--text-edit-color").trim() || "oklch(62.3% 0.214 259.815)";
};

const createCornerHandle = (group: SVGGElement, x: number, y: number, className: string, isInstance: boolean = false, isTextEdit: boolean = false): SVGRectElement => {
  const handle = document.createElementNS("http://www.w3.org/2000/svg", "rect");
  // Position relative to group (offset by half handle size to center on corner)
  handle.setAttribute("x", (x - HANDLE_SIZE / 2).toString());
  handle.setAttribute("y", (y - HANDLE_SIZE / 2).toString());
  handle.setAttribute("width", HANDLE_SIZE.toString());
  handle.setAttribute("height", HANDLE_SIZE.toString());
  handle.setAttribute("vector-effect", "non-scaling-stroke");
  handle.classList.add("highlight-frame-handle", className);

  if (isInstance) {
    handle.setAttribute("stroke", getComponentColor());
  } else if (isTextEdit) {
    handle.setAttribute("stroke", getTextEditColor());
  }

  group.appendChild(handle);
  return handle;
};

export const createCornerHandles = (group: SVGGElement, width: number, height: number, isInstance: boolean = false, isTextEdit: boolean = false): void => {
  // Create corner handles using relative coordinates (group handles positioning)
  createCornerHandle(group, 0, 0, "handle-top-left", isInstance, isTextEdit);
  createCornerHandle(group, width, 0, "handle-top-right", isInstance, isTextEdit);
  createCornerHandle(group, width, height, "handle-bottom-right", isInstance, isTextEdit);
  createCornerHandle(group, 0, height, "handle-bottom-left", isInstance, isTextEdit);
};
