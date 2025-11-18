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

    // Refresh highlight frame (throttled via withRAFThrottle)
    // biome-ignore lint/suspicious/noExplicitAny: global window extension
    const nodeTools = (window as any).nodeTools;
    if (nodeTools?.refreshHighlightFrame) {
      nodeTools.refreshHighlightFrame();
    }
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
