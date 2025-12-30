import { getViewportLabelOverlay } from "./getViewportLabelOverlay";

/**
 * Removes a viewport label for a single viewport element.
 * @param viewportElement - The viewport element to remove the label for
 */
export const removeViewportLabel = (viewportElement: HTMLElement): void => {
  const viewportName = viewportElement.getAttribute("data-viewport-name");

  if (!viewportName) {
    return;
  }

  const overlay = getViewportLabelOverlay();
  const labelGroup = overlay.querySelector(`[data-viewport-name="${viewportName}"]`);

  if (labelGroup) {
    labelGroup.remove();
  }
};
