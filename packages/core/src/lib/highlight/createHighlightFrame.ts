export const createHighlightFrame = (top: number, left: number, width: number, height: number): HTMLElement => {
  const frame = document.createElement("div");
  frame.classList.add("highlight-frame");

  frame.style.position = "absolute";
  frame.style.top = `${top}px`;
  frame.style.left = `${left}px`;
  frame.style.width = `${width}px`;
  frame.style.height = `${height}px`;
  frame.style.zIndex = "1000";
  frame.style.pointerEvents = "none";
  frame.style.border = "2px solid red";

  const highlightFrame = frame

  return highlightFrame;
};