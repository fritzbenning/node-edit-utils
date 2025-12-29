import { createDragHandler } from "../../helpers/createDragHandler";
import type { NodeTools } from "../../node-tools/types";
import { sendPostMessage } from "../../post-message/sendPostMessage";
import { getLabelPosition } from "./helpers/getLabelPosition";
import { getTransformValues } from "./helpers/getTransformValues";
import { getZoomValue } from "./helpers/getZoomValue";
import { selectFirstViewportNode } from "./helpers/selectFirstViewportNode";
import { setViewportLabelDragging } from "./isViewportLabelDragging";

export const setupViewportLabelDrag = (labelElement: SVGTextElement, viewportElement: HTMLElement, viewportName: string): (() => void) => {
  // Get the parent group element that contains the label
  const labelGroup = labelElement.parentElement as unknown as SVGGElement;

  // Track initial positions for calculations
  let initialTransform = { x: 0, y: 0 };
  let initialLabelPosition = { x: 0, y: 0 };

  return createDragHandler(labelElement, {
    onStart: () => {
      setViewportLabelDragging(true);
      initialTransform = getTransformValues(viewportElement);
      initialLabelPosition = getLabelPosition(labelGroup);
      selectFirstViewportNode(viewportElement);
    },
    onDrag: (_event, { deltaX, deltaY }) => {
      const zoom = getZoomValue();

      // Adjust delta for zoom level (viewport is in canvas space)
      const deltaXZoomed = deltaX / zoom;
      const deltaYZoomed = deltaY / zoom;

      // Calculate new positions
      const newX = initialTransform.x + deltaXZoomed;
      const newY = initialTransform.y + deltaYZoomed;

      // Update label position with raw delta (labels are in screen space)
      const newLabelX = initialLabelPosition.x + deltaX;
      const newLabelY = initialLabelPosition.y + deltaY;
      labelGroup.setAttribute("transform", `translate(${newLabelX}, ${newLabelY})`);

      // Update viewport position with zoom-adjusted delta
      viewportElement.style.transform = `translate3d(${newX}px, ${newY}px, 0)`;
    },
    onStop: (_event, { hasDragged }) => {
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
    },
    onCancel: () => {
      setViewportLabelDragging(false);
    },
    onPreventClick: () => {},
  });
};
