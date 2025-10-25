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

    this.cleanupEventListener = setupEventListener(this.resizeHandle, this.startResize, this.handleResize, this.stopResize);
  }

  private startResize = (event: MouseEvent): void => {
    this.isDragging = true;
    this.startX = event.clientX;
    this.startWidth = this.container.offsetWidth;
    console.log("startX", this.startX);
    console.log("startWidth", this.startWidth);
  };

  private handleResize = (event: MouseEvent): void => {
    console.log("this.isDragging in handleResize", this.isDragging);
    if (!this.isDragging) return;
    console.log("this.isDragging", this.isDragging);
    updateContainerWidth(this.container, event, this.startX, this.startWidth);
  };

  private stopResize = (): void => {
    this.isDragging = false;
    console.log("stopResize");
  };

  cleanup() {
    console.log("cleanup");
    this.isDragging = false;
    this.cleanupEventListener?.();
  }
}
