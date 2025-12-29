import type { NodeTools } from "../../node-tools/types";
import { sendPostMessage } from "../../post-message/sendPostMessage";
import { getLabelPosition } from "./helpers/getLabelPosition";
import { getTransformValues } from "./helpers/getTransformValues";
import { getZoomValue } from "./helpers/getZoomValue";
import { selectFirstViewportNode } from "./helpers/selectFirstViewportNode";
import { setViewportLabelDragging } from "./isViewportLabelDragging";

export const setupViewportLabelDrag = (labelElement: SVGTextElement, viewportElement: HTMLElement, viewportName: string): (() => void) => {
  let isDragging = false;
  let hasDragged = false;
  let startX = 0;
  let startY = 0;
  let initialTransform = { x: 0, y: 0 };
  let initialLabelPosition = { x: 0, y: 0 };

  // Get the parent group element that contains the label
  const labelGroup = labelElement.parentElement as unknown as SVGGElement;

  const startDrag = (event: MouseEvent): void => {
    event.preventDefault();
    event.stopPropagation();

    isDragging = true;
    hasDragged = false;

    setViewportLabelDragging(true);

    startX = event.clientX;
    startY = event.clientY;

    initialTransform = getTransformValues(viewportElement);
    initialLabelPosition = getLabelPosition(labelGroup);

    selectFirstViewportNode(viewportElement);
  };

  const handleDrag = (event: MouseEvent): void => {
    if (!isDragging) return;

    const zoom = getZoomValue();

    // Calculate mouse delta
    const rawDeltaX = event.clientX - startX;
    const rawDeltaY = event.clientY - startY;

    hasDragged = true;

    // Adjust delta for zoom level
    const deltaX = rawDeltaX / zoom;
    const deltaY = rawDeltaY / zoom;

    const newX = initialTransform.x + deltaX;
    const newY = initialTransform.y + deltaY;

    // Update label position with raw delta (labels are in screen space)
    const newLabelX = initialLabelPosition.x + rawDeltaX;
    const newLabelY = initialLabelPosition.y + rawDeltaY;
    labelGroup.setAttribute("transform", `translate(${newLabelX}, ${newLabelY})`);

    // Update viewport position with zoom-adjusted delta
    viewportElement.style.transform = `translate3d(${newX}px, ${newY}px, 0)`;
  };

  const stopDrag = (event: MouseEvent): void => {
    if (!isDragging) return;

    event.preventDefault();
    event.stopPropagation();

    isDragging = false;
    setViewportLabelDragging(false);

    // If it was a drag, handle drag completion
    if (hasDragged) {
      const finalTransform = getTransformValues(viewportElement);

      // Trigger refresh after drag completes to update highlight frame and labels
      const nodeTools = (window as Window & { nodeTools?: NodeTools }).nodeTools;
      if (nodeTools?.refreshHighlightFrame) {
        nodeTools.refreshHighlightFrame();
      }

      // Notify parent about the new position
      sendPostMessage("viewport-position-changed", {
        viewportName,
        x: finalTransform.x,
        y: finalTransform.y,
      });
    }
  };

  const cancelDrag = (): void => {
    isDragging = false;
    setViewportLabelDragging(false);
  };

  const preventClick = (event: MouseEvent): void => {
    // Always prevent clicks on the label element to avoid the document click handler
    // clearing the selection. We handle selection ourselves in startDrag.
    event.preventDefault();
    event.stopPropagation();

    // Reset hasDragged flag after handling the click
    if (hasDragged) {
      hasDragged = false;
    }
  };

  // Attach event listeners
  labelElement.addEventListener("mousedown", startDrag);
  labelElement.addEventListener("click", preventClick);
  document.addEventListener("mousemove", handleDrag);
  document.addEventListener("mouseup", stopDrag);
  window.addEventListener("blur", cancelDrag);

  // Return cleanup function
  return () => {
    labelElement.removeEventListener("mousedown", startDrag);
    labelElement.removeEventListener("click", preventClick);
    document.removeEventListener("mousemove", handleDrag);
    document.removeEventListener("mouseup", stopDrag);
    window.removeEventListener("blur", cancelDrag);
  };
};
