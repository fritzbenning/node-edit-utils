import { getViewportDimensions } from "../../helpers/getViewportDimensions";
import { getViewportLabelsOverlay } from "./getViewportLabelsOverlay";
import { isViewportLabelDragging } from "./isViewportLabelDragging";
import { refreshViewportLabel } from "./refreshViewportLabel";

export const refreshViewportLabels = (): void => {
  // Skip refresh if a viewport label is being dragged
  if (isViewportLabelDragging()) {
    return;
  }

  const overlay = getViewportLabelsOverlay();

  // Update SVG dimensions to match current viewport (handles window resize and ensures coordinate system is correct)
  const { width: viewportWidth, height: viewportHeight } = getViewportDimensions();
  overlay.setAttribute("width", viewportWidth.toString());
  overlay.setAttribute("height", viewportHeight.toString());

  // Find all viewports with names and refresh each label
  const viewports = document.querySelectorAll(".viewport[data-viewport-name]");
  viewports.forEach((viewport) => {
    refreshViewportLabel(viewport as HTMLElement);
  });

  // Remove labels for viewports that no longer exist
  const existingGroups = overlay.querySelectorAll(".viewport-label-group");
  existingGroups.forEach((group) => {
    const viewportName = group.getAttribute("data-viewport-name");
    if (viewportName) {
      const viewportExists = Array.from(viewports).some((viewport) => viewport.getAttribute("data-viewport-name") === viewportName);
      if (!viewportExists) {
        group.remove();
      }
    }
  });
};
