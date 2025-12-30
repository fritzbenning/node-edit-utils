import { getScreenBounds } from "../../node-tools/highlight/helpers/getScreenBounds";
import { getViewportLabelsOverlay } from "./getViewportLabelsOverlay";
import { setupViewportLabelDrag } from "./setupViewportLabelDrag";

/**
 * Creates a viewport label for a single viewport element.
 * @param viewportElement - The viewport element to create a label for
 * @returns Cleanup function to remove the label and its event listeners
 */
export const createViewportLabel = (viewportElement: HTMLElement): (() => void) | null => {
  const viewportName = viewportElement.getAttribute("data-viewport-name");

  if (!viewportName) {
    return null;
  }

  const overlay = getViewportLabelsOverlay();
  const bounds = getScreenBounds(viewportElement);

  // Create group for this viewport label
  const group = document.createElementNS("http://www.w3.org/2000/svg", "g");
  group.classList.add("viewport-label-group");
  group.setAttribute("data-viewport-name", viewportName);
  group.setAttribute("transform", `translate(${bounds.left}, ${bounds.top})`);

  // Create text element
  const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
  text.classList.add("viewport-label-text");
  text.setAttribute("x", "0");
  text.setAttribute("y", "-8");
  text.setAttribute("vector-effect", "non-scaling-stroke");
  text.setAttribute("pointer-events", "auto");
  text.textContent = viewportName;

  group.appendChild(text);
  overlay.appendChild(group);

  // Setup drag functionality for this label
  const cleanup = setupViewportLabelDrag(text, viewportElement, viewportName);

  // Return cleanup function that removes the label and its listeners
  return () => {
    cleanup();
    group.remove();
  };
};
