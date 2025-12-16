import { applyCanvasState } from "./helpers/applyCanvasState";
import type { CanvasObserver } from "./types";

export function createCanvasObserver(canvasName: string = "canvas"): CanvasObserver {
  const transformLayer = document.querySelector(".transform-layer");

  if (!transformLayer) {
    return {
      disconnect: () => {},
    };
  }

  const observer = new MutationObserver(() => {
    applyCanvasState(canvasName);

    // Refresh highlight frame (throttled via withRAFThrottle)
    // biome-ignore lint/suspicious/noExplicitAny: global window extension
    const nodeTools = (window as any).nodeTools;

    if (nodeTools?.refreshHighlightFrame) {
      console.log("refreshHighlightFrame in mutationObserver 3");
      nodeTools.refreshHighlightFrame();
    }
  });

  observer.observe(transformLayer, {
    attributes: true,
    attributeOldValue: true,
    subtree: true,
    childList: true,
  });

  function disconnect(): void {
    observer.disconnect();
  }

  return {
    disconnect,
  };
}
