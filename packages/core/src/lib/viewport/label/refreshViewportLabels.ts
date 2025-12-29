import { getViewportDimensions } from "../../helpers/getViewportDimensions";
import { getScreenBounds } from "../../node-tools/highlight/helpers/getScreenBounds";
import { getViewportLabelsOverlay } from "./getViewportLabelsOverlay";
import { isViewportLabelDragging } from "./isViewportLabelDragging";
import { setupViewportLabelDrag } from "./setupViewportLabelDrag";

// Store cleanup functions for drag listeners
const dragCleanupFunctions = new Map<string, () => void>();

export const refreshViewportLabels = (): void => {
  // Skip refresh if a viewport label is being dragged
  if (isViewportLabelDragging()) {
    return;
  }

  const overlay = getViewportLabelsOverlay();

  // Update SVG dimensions to match current viewport
  const { width: viewportWidth, height: viewportHeight } = getViewportDimensions();
  overlay.setAttribute("width", viewportWidth.toString());
  overlay.setAttribute("height", viewportHeight.toString());

  // Find all viewports with names
  const viewports = document.querySelectorAll(".viewport[data-viewport-name]");

  // Clean up existing drag listeners
  dragCleanupFunctions.forEach((cleanup) => {
    cleanup();
  });
  dragCleanupFunctions.clear();

  // Remove existing label groups
  const existingGroups = overlay.querySelectorAll(".viewport-label-group");
  existingGroups.forEach((group) => {
    group.remove();
  });

  // Create/update labels for each viewport
  viewports.forEach((viewport) => {
    const viewportElement = viewport as HTMLElement;
    const viewportName = viewportElement.getAttribute("data-viewport-name");

    if (!viewportName) return;

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
    dragCleanupFunctions.set(viewportName, cleanup);
  });
};
