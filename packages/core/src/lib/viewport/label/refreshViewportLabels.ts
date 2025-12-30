import { getViewportDimensions } from "../../helpers/getViewportDimensions";
import { createViewportLabel } from "./createViewportLabel";
import { getViewportLabelsOverlay } from "./getViewportLabelsOverlay";
import { isViewportLabelDragging } from "./isViewportLabelDragging";

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
    const cleanup = createViewportLabel(viewportElement);

    if (cleanup) {
      const viewportName = viewportElement.getAttribute("data-viewport-name");
      if (viewportName) {
        dragCleanupFunctions.set(viewportName, cleanup);
      }
    }
  });
};
