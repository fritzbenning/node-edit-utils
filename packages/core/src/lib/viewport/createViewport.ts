import { getCanvasContainer } from "../canvas/helpers/getCanvasContainer";
import { refreshHighlightFrame } from "../node-tools/highlight/refreshHighlightFrame";
import { DEFAULT_WIDTH } from "./constants";
import { setupEventListener } from "./events/setupEventListener";
import { refreshViewportLabels } from "./label/refreshViewportLabels";
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

  let isDragging: boolean = false;
  let startX: number = 0;
  let startWidth: number = 0;

  const startResize = (event: MouseEvent): void => {
    event.preventDefault();
    event.stopPropagation();

    isDragging = true;
    startX = event.clientX;
    startWidth = container.offsetWidth;
  };

  const handleResize = (event: MouseEvent): void => {
    if (!isDragging) return;

    if (canvas) {
      canvas.style.cursor = "ew-resize";
    }

    const width = calcWidth(event, startX, startWidth);
    updateWidth(container, width);
  };

  const stopResize = (event: MouseEvent): void => {
    event.preventDefault();
    event.stopPropagation();

    if (canvas) {
      canvas.style.cursor = "default";
    }

    isDragging = false;
  };

  const blurResize = (): void => {
    if (canvas) {
      canvas.style.cursor = "default";
    }

    isDragging = false;
  };

  const removeListeners = setupEventListener(resizeHandle, startResize, handleResize, stopResize, blurResize);

  // Refresh viewport labels when viewport is created
  refreshViewportLabels();

  const cleanup = (): void => {
    isDragging = false;
    removeListeners();
    resizeHandle.remove();
    // Refresh labels after cleanup to remove this viewport's label if needed
    refreshViewportLabels();
  };

  return {
    setWidth: (width: number): void => {
      updateWidth(container, width);
      refreshViewportLabels();

      // Refresh highlight frame when viewport width changes to update node positions
      // biome-ignore lint/suspicious/noExplicitAny: global window extension
      const nodeTools = (window as any).nodeTools;
      const selectedNode = nodeTools?.getSelectedNode?.();
      const nodeProvider = document.querySelector('[data-role="node-provider"]') as HTMLElement | null;

      if (selectedNode && nodeProvider) {
        refreshHighlightFrame(selectedNode, nodeProvider);
      }
    },
    cleanup,
  };
};
