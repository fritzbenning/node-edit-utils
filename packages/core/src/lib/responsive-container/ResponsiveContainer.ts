import { createCanvasObserver } from "../canvas/createCanvasObserver";
import { withRAFThrottle } from "../helpers";
import { setupEventListener } from "./events/setupEventListener";
import { createResizeHandle } from "./resize/createResizeHandle";
import { updateWidth } from "./width/updateWidth";

export class ResponsiveContainer {
  private cleanupEventListener: (() => void) | null = null;
  private cleanupCanvasObserver: (() => void) | null = null;
  private container: HTMLElement;
  private resizeHandle: HTMLElement | null = null;
  private throttledHandleResize: ReturnType<typeof withRAFThrottle> | null = null;

  private currentWidth: number = 400;
  private isDragging: boolean = false;
  private startX: number = 0;
  private startWidth: number = 0;

  constructor(container: HTMLElement) {
    this.container = container;
    this.init();
  }

  private init(): void {
    this.resizeHandle = createResizeHandle(this.container);
    this.container.style.setProperty("--container-width", `${this.currentWidth}px`);

    this.throttledHandleResize = withRAFThrottle(this.handleResize);

    this.cleanupEventListener = setupEventListener(
      this.resizeHandle,
      this.startResize,
      this.throttledHandleResize,
      this.stopResize,
      this.blurResize
    );

    const canvasObserver = createCanvasObserver();
    this.cleanupCanvasObserver = () => {
      canvasObserver.disconnect();
    };
  }

  private startResize = (event: MouseEvent): void => {
    event.preventDefault();
    event.stopPropagation();

    this.isDragging = true;
    this.startX = event.clientX;
    this.startWidth = this.container.offsetWidth;
  };

  private handleResize = (event: MouseEvent): void => {
    if (!this.isDragging) return;
    const canvas: HTMLElement | null = document.querySelector(".canvas-container");
    if (canvas) {
      canvas.style.cursor = "ew-resize";
    }
    updateWidth(this.container, event, this.startX, this.startWidth);
  };

  private stopResize = (event: MouseEvent): void => {
    event.preventDefault();
    event.stopPropagation();

    const canvas: HTMLElement | null = document.querySelector(".canvas-container");
    if (canvas) {
      canvas.style.cursor = "default";
    }

    this.isDragging = false;
  };

  private blurResize = (): void => {
    this.isDragging = false;
  };

  cleanup() {
    this.isDragging = false;
    this.throttledHandleResize?.cleanup();
    this.cleanupEventListener?.();
    if (this.cleanupCanvasObserver) {
      this.cleanupCanvasObserver();
      this.cleanupCanvasObserver = null;
    }
  }
}
