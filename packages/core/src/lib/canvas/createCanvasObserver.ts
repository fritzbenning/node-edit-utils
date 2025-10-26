import { withRAFThrottle } from "../helpers/withRAF";
import { applyCanvasState } from "./helpers/applyCanvasState";

interface CanvasObserverInstance {
  disconnect: () => void;
}

export function createCanvasObserver(): CanvasObserverInstance {
  const transformLayer = document.querySelector(".transform-layer");

  console.log("transformLayer", transformLayer);

  if (!transformLayer) {
    return {
      disconnect: () => {},
    };
  }

  const throttledUpdate = withRAFThrottle(() => {
    applyCanvasState();
    console.log("applyCanvasState");
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
