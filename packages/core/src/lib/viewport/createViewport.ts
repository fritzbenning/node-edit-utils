import { getCanvasContainer } from "../canvas/helpers/getCanvasContainer";
import { withRAFThrottle } from "../helpers";
import { DEFAULT_WIDTH } from "./constants";
import { setupEventListener } from "./events/setupEventListener";
import { createResizeHandle } from "./resize/createResizeHandle";
import type { Viewport } from "./types";
import { calcWidth } from "./width/calcWidth";
import { updateWidth } from "./width/updateWidth";

export const createViewport = (container: HTMLElement): Viewport => {
  const canvas: HTMLElement | null = getCanvasContainer();
  const resizeHandle = createResizeHandle(container);
  container.style.setProperty("--container-width", `${DEFAULT_WIDTH}px`);

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

  const throttledHandleResize = withRAFThrottle(handleResize);

  const stopResize = (event: MouseEvent): void => {
    event.preventDefault();
    event.stopPropagation();

    if (canvas) {
      canvas.style.cursor = "default";
    }

    isDragging = false;
  };

  const blurResize = (): void => {
    isDragging = false;
  };

  const removeListeners = setupEventListener(resizeHandle, startResize, throttledHandleResize, stopResize, blurResize);

  const cleanup = (): void => {
    isDragging = false;
    throttledHandleResize?.cleanup();
    removeListeners();
  };

  return {
    setWidth: (width: number): void => {
      updateWidth(container, width);
    },
    cleanup,
  };
};
