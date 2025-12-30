import { getScreenBounds } from "../../node-tools/highlight/helpers/getScreenBounds";
import { getViewportLabelOverlay } from "./getViewportLabelOverlay";
import { setupViewportDrag } from "./setupViewportDrag";

/**
 * Refreshes (updates) a viewport label for a single viewport element.
 * Creates the label if it doesn't exist, or updates its position if it does.
 * Similar to refreshHighlightFrame - updates existing elements rather than recreating.
 *
 * @param viewportElement - The viewport element to refresh the label for
 */
export const refreshViewportLabel = (viewportElement: HTMLElement): void => {
  const viewportName = viewportElement.getAttribute("data-viewport-name");

  if (!viewportName) {
    return;
  }

  const overlay = getViewportLabelOverlay();
  const bounds = getScreenBounds(viewportElement);

  // Get existing label group or create if it doesn't exist
  let group = overlay.querySelector(`[data-viewport-name="${viewportName}"]`) as SVGGElement | null;

  if (!group) {
    // Create group for this viewport label
    group = document.createElementNS("http://www.w3.org/2000/svg", "g");
    group.classList.add("viewport-label-group");
    group.setAttribute("data-viewport-name", viewportName);

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

    // Setup drag functionality only when creating new label
    setupViewportDrag(text, viewportElement, viewportName);
  }

  // Update label position (this is the refresh part - updates existing label)
  group.setAttribute("transform", `translate(${bounds.left}, ${bounds.top})`);
};

