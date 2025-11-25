const HANDLE_SIZE = 6;

const getComponentColor = (): string => {
  return getComputedStyle(document.documentElement).getPropertyValue("--component-color").trim() || "oklch(65.6% 0.241 354.308)";
};

const createCornerHandle = (group: SVGGElement, x: number, y: number, className: string, isInstance: boolean = false): SVGRectElement => {
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
  }

  group.appendChild(handle);
  return handle;
};

export const createCornerHandles = (group: SVGGElement, width: number, height: number, isInstance: boolean = false): void => {
  // Create corner handles using relative coordinates (group handles positioning)
  createCornerHandle(group, 0, 0, "handle-top-left", isInstance);
  createCornerHandle(group, width, 0, "handle-top-right", isInstance);
  createCornerHandle(group, width, height, "handle-bottom-right", isInstance);
  createCornerHandle(group, 0, height, "handle-bottom-left", isInstance);
};
