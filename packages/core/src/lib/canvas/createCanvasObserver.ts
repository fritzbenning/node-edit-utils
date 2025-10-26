import { withRAFThrottle } from "../helpers/withRAF";
import { applyCanvasState } from "./helpers/applyCanvasState";
import type { CanvasObserver } from "./types";

export function createCanvasObserver(): CanvasObserver {
  const transformLayer = document.querySelector(".transform-layer");

  if (!transformLayer) {
    return {
      disconnect: () => {},
    };
  }

  const throttledUpdate = withRAFThrottle(() => {
    applyCanvasState();
  });

  const observer = new MutationObserver(() => {
    throttledUpdate();
  });

  observer.observe(transformLayer, {
    attributes: true,
    attributeOldValue: true,
    subtree: true,
    childList: true,
  });

  function disconnect(): void {
    throttledUpdate.cleanup();
    observer.disconnect();
  }

  return {
    disconnect,
  };
}
