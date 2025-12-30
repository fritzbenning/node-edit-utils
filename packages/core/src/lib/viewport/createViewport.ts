import { getCanvasContainer } from "../canvas/helpers/getCanvasContainer";
import { createDragHandler } from "../helpers/createDragHandler";
import { getNodeProvider } from "../helpers/getNodeProvider";
import { getNodeTools } from "../helpers/getNodeTools";
import { refreshHighlightFrame } from "../node-tools/highlight/refreshHighlightFrame";
import { DEFAULT_WIDTH } from "./constants";
import { refreshViewportLabel } from "./label/refreshViewportLabel";
import { removeViewportLabel } from "./label/removeViewportLabel";
import { createResizeHandle } from "./resize/createResizeHandle";
import { createResizePresets } from "./resize/createResizePresets";
import type { Viewport } from "./types";
import { calcWidth } from "./width/calcWidth";
import { updateWidth } from "./width/updateWidth";

export const createViewport = (container: HTMLElement, initialWidth?: number): Viewport => {
  const canvas: HTMLElement | null = getCanvasContainer();

  // Remove any existing resize handle to prevent duplicates
  const existingHandle = container.querySelector(".resize-handle");

  if (existingHandle) {
    existingHandle.remove();
  }

  const resizeHandle = createResizeHandle(container);
  const width = initialWidth ?? DEFAULT_WIDTH;
  container.style.setProperty("--container-width", `${width}px`);

  createResizePresets(resizeHandle, container, updateWidth);

  // Track initial values for resize calculation
  let startX = 0;
  let startWidth = 0;

  // Handle mouse leave for resize (specific to resize use case)
  const handleMouseLeave = (event: MouseEvent): void => {
    // Check if mouse is leaving the window/document
    if (!event.relatedTarget && (event.target === document || event.target === document.documentElement)) {
      if (canvas) {
        canvas.style.cursor = "default";
      }
    }
  };

  const removeDragListeners = createDragHandler(resizeHandle, {
    onStart: (_event, { startX: dragStartX }) => {
      startX = dragStartX;
      startWidth = container.offsetWidth;
    },
    onDrag: (event) => {
      if (canvas) {
        canvas.style.cursor = "ew-resize";
      }

      const width = calcWidth(event, startX, startWidth);
      updateWidth(container, width);
    },
    onStop: () => {
      if (canvas) {
        canvas.style.cursor = "default";
      }
    },
    onCancel: () => {
      if (canvas) {
        canvas.style.cursor = "default";
      }
    },
    onPreventClick: () => {},
  });

  document.addEventListener("mouseleave", handleMouseLeave);

  // Create/refresh the label for this viewport
  refreshViewportLabel(container);

  const cleanup = (): void => {
    removeDragListeners();
    document.removeEventListener("mouseleave", handleMouseLeave);
    resizeHandle.remove();

    // Remove the label for this viewport
    removeViewportLabel(container);
  };

  return {
    setWidth: (width: number): void => {
      updateWidth(container, width);
      refreshViewportLabel(container);

      const nodeTools = getNodeTools();
      const selectedNode = nodeTools?.getSelectedNode?.();
      const nodeProvider = getNodeProvider();

      if (selectedNode && nodeProvider) {
        refreshHighlightFrame(selectedNode, nodeProvider);
      }
    },
    cleanup,
  };
};
