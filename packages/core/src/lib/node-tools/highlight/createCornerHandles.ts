const HANDLE_SIZE = 6;

const createCornerHandle = (
  svg: SVGSVGElement,
  x: number,
  y: number,
  className: string
): SVGRectElement => {
  const handle = document.createElementNS("http://www.w3.org/2000/svg", "rect");
  handle.setAttribute("x", (x - HANDLE_SIZE / 2).toString());
  handle.setAttribute("y", (y - HANDLE_SIZE / 2).toString());
  handle.setAttribute("width", HANDLE_SIZE.toString());
  handle.setAttribute("height", HANDLE_SIZE.toString());
  handle.setAttribute("vector-effect", "non-scaling-stroke");
  handle.classList.add("highlight-frame-handle", className);
  svg.appendChild(handle);
  return handle;
};

export const createCornerHandles = (
  svg: SVGSVGElement,
  top: number,
  left: number,
  width: number,
  height: number
): void => {
  // Create corner handles
  createCornerHandle(svg, left, top, "handle-top-left");
  createCornerHandle(svg, left + width, top, "handle-top-right");
  createCornerHandle(svg, left + width, top + height, "handle-bottom-right");
  createCornerHandle(svg, left, top + height, "handle-bottom-left");
};

