import { updateContainerWidth } from "./responsive-container/container-width/updateContainerWidth";
import { setupEventListener } from "./responsive-container/events/setupEventListener";
import { createResizeHandle } from "./responsive-container/resize-handle/createResizeHandle";

export class ResponsiveContainer {
  private cleanupEventListener: (() => void) | null = null;
  private container: HTMLElement;
  private resizeHandle: HTMLElement | null = null;

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

    this.cleanupEventListener = setupEventListener(
      this.resizeHandle,
      this.startResize,
      this.handleResize,
      this.stopResize,
      this.blurResize
    );
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
    updateContainerWidth(this.container, event, this.startX, this.startWidth);
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
    this.cleanupEventListener?.();
  }
}
