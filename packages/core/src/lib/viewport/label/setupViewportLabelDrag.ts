import { sendPostMessage } from "../../post-message/sendPostMessage";
import { getLabelPosition } from "./helpers/getLabelPosition";
import { getTransformValues } from "./helpers/getTransformValues";
import { getZoomValue } from "./helpers/getZoomValue";
import { setViewportLabelDragging } from "./isViewportLabelDragging";

export const setupViewportLabelDrag = (labelElement: SVGTextElement, viewportElement: HTMLElement, viewportName: string): (() => void) => {
  let isDragging = false;
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
    setViewportLabelDragging(true);
    startX = event.clientX;
    startY = event.clientY;
    initialTransform = getTransformValues(viewportElement);
    initialLabelPosition = getLabelPosition(labelGroup);
  };

  const handleDrag = (event: MouseEvent): void => {
    if (!isDragging) return;

    const zoom = getZoomValue();

    // Calculate mouse delta
    const rawDeltaX = event.clientX - startX;
    const rawDeltaY = event.clientY - startY;

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

    const finalTransform = getTransformValues(viewportElement);

    // Trigger refresh after drag completes to update highlight frame and labels
    // biome-ignore lint/suspicious/noExplicitAny: global window extension
    const nodeTools = (window as any).nodeTools;
    if (nodeTools?.refreshHighlightFrame) {
      nodeTools.refreshHighlightFrame();
    }

    // Notify parent about the new position
    sendPostMessage("viewport-position-changed", {
      viewportName,
      x: finalTransform.x,
      y: finalTransform.y,
    });
  };

  const cancelDrag = (): void => {
    isDragging = false;
    setViewportLabelDragging(false);
  };

  // Attach event listeners
  labelElement.addEventListener("mousedown", startDrag);
  document.addEventListener("mousemove", handleDrag);
  document.addEventListener("mouseup", stopDrag);
  window.addEventListener("blur", cancelDrag);

  // Return cleanup function
  return () => {
    labelElement.removeEventListener("mousedown", startDrag);
    document.removeEventListener("mousemove", handleDrag);
    document.removeEventListener("mouseup", stopDrag);
    window.removeEventListener("blur", cancelDrag);
  };
};
