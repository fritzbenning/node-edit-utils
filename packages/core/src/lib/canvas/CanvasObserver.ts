import { withRAFThrottle } from "../helpers/withRAF";

type ObserverCallback = (mutations: MutationRecord[]) => void;

export class CanvasObserver {
  private static instance: CanvasObserver | null = null;
  private observer: MutationObserver | null = null;
  private callbacks: Set<ObserverCallback> = new Set();
  private subscriptionCount: number = 0;
  private throttledUpdate: ReturnType<typeof withRAFThrottle> | null = null;

  private constructor() {}

  static getInstance(): CanvasObserver {
    if (!CanvasObserver.instance) {
      CanvasObserver.instance = new CanvasObserver();
    }
    return CanvasObserver.instance;
  }

  subscribe(callback: ObserverCallback): () => void {
    this.callbacks.add(callback);
    this.subscriptionCount++;

    if (this.subscriptionCount === 1) {
      this.start();
    }

    // Return unsubscribe function
    return () => {
      this.callbacks.delete(callback);
      this.subscriptionCount--;

      if (this.subscriptionCount === 0) {
        this.stop();
      }
    };
  }

  private start(): void {
    const transformLayer = document.querySelector(".transform-layer");

    if (!transformLayer) {
      return;
    }

    this.throttledUpdate = withRAFThrottle((mutations: MutationRecord[]) => {
      // Update CSS variables based on current zoom
      // biome-ignore lint/suspicious/noExplicitAny: global window extension
      const zoom = (window as any).canvas?.zoom.current ?? 1;
      document.body.style.setProperty("--zoom", zoom.toFixed(5));
      document.body.style.setProperty("--stroke-width", (2 / zoom).toFixed(3));
      document.body.dataset.zoom = zoom.toFixed(5);
      document.body.dataset.strokeWidth = (2 / zoom).toFixed(3);

      // Call all subscribed callbacks
      this.callbacks.forEach((callback) => {
        callback(mutations);
      });
    });

    this.observer = new MutationObserver((mutations: MutationRecord[]) => {
      this.throttledUpdate?.(mutations);
    });

    this.observer.observe(transformLayer, {
      attributes: true,
      attributeOldValue: true,
      subtree: true,
      childList: true,
    });
  }

  private stop(): void {
    if (this.throttledUpdate) {
      this.throttledUpdate.cleanup();
      this.throttledUpdate = null;
    }

    if (this.observer) {
      this.observer.disconnect();
      this.observer = null;
    }
  }
}
